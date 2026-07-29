import { Payment, MerchantOrder, MercadoPagoConfig } from "mercadopago"
import { db } from "../../db"
import { userCredits, creditHistory } from "../../db/credits/schema"
import { eq, and, sql } from "drizzle-orm"
import crypto, { randomUUID } from "node:crypto"

const CREDIT_MAP: Record<string, number> = {
	"por informe": 1,
	mensual: 7,
	anual: 100,
}

function getClient() {
	const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
	if (!accessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN not set")
	return new MercadoPagoConfig({ accessToken })
}

async function verifyPayment(paymentId: number) {
	const payment = new Payment(getClient())
	return await payment.get({ id: paymentId })
}

async function findPaymentIdFromMerchantOrder(merchantOrderId: number): Promise<number | null> {
	const merchantOrder = new MerchantOrder(getClient())
	const order = await merchantOrder.get({ merchantOrderId })
	const payment = order.payments?.find(p => p.status === "approved")
	return payment?.id ?? null
}

async function creditUser(paymentId: number, userId: string, planId: string) {
	const credits = CREDIT_MAP[planId]
	if (!credits) return

	const existing = await db
		.select({ id: creditHistory.id })
		.from(creditHistory)
		.where(
			and(
				eq(creditHistory.paymentId, String(paymentId)),
				eq(creditHistory.type, "purchase"),
			),
		)
		.limit(1)

	if (existing.length > 0) return

	await db.transaction(async (tx) => {
		await tx
			.insert(userCredits)
			.values({ userId, credits })
			.onConflictDoUpdate({
				target: userCredits.userId,
				set: { credits: sql`${userCredits.credits} + ${credits}` },
			})

		await tx.insert(creditHistory).values({
			id: randomUUID(),
			userId,
			type: "purchase",
			credits,
			paymentId: String(paymentId),
		})
	})

	console.log(`[MP] Credited ${credits} credits to user ${userId} (payment ${paymentId})`)
}

async function processPaymentId(paymentId: number) {
	let payment
	try {
		payment = await verifyPayment(paymentId)
	} catch (err) {
		console.error("[MP] Error verifying payment", paymentId, err)
		return
	}

	if (payment.status !== "approved") return

	const userId = String(payment.external_reference ?? "")
	if (!userId) return

	const planId = String(
		payment.metadata?.plan_id ??
		payment.additional_info?.items?.[0]?.id ??
		"",
	).toLowerCase()

	await creditUser(paymentId, userId, planId)
}

async function processNotification(notification: { type?: string; data?: { id: number | string } }) {
	if (notification.type === "payment") {
		const paymentId = Number(notification.data?.id)
		if (paymentId) await processPaymentId(paymentId)
	}
}

async function processIPNTopic(topic: string, id: number) {
	if (topic === "payment") {
		await processPaymentId(id)
	} else if (topic === "merchant_order") {
		const paymentId = await findPaymentIdFromMerchantOrder(id)
		if (paymentId) await processPaymentId(paymentId)
	}
}

function validateSignature(headers: Headers, body: string): boolean {
	const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET
	if (!secret) return true

	const signature = headers.get("x-signature") ?? ""
	const requestId = headers.get("x-request-id") ?? ""

	let dataId: string
	try {
		dataId = String(JSON.parse(body).data?.id ?? "")
	} catch {
		return false
	}

	const parts = Object.fromEntries(signature.split(",").map(p => p.split("=")))
	const ts = parts["ts"]
	const v1 = parts["v1"]
	if (!ts || !v1) return false

	const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
	const computed = crypto
		.createHmac("sha256", secret)
		.update(manifest)
		.digest("hex")

	if (computed.length !== v1.length) return false
	return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1))
}

export async function handleWebhook(request: Request): Promise<Response> {
	const url = new URL(request.url)
	const method = request.method
	console.log("[MP] Webhook received:", method, url.pathname, url.search)

	const query = Object.fromEntries(url.searchParams)

	// Handle via query params (IPN style: ?topic=payment&id=... or ?type=payment&data.id=...)
	if (query.type || query.topic) {
		console.log("[MP] IPN notification (query params):", JSON.stringify(query))
		const type = query.type ?? query.topic ?? ""
		const id = Number(query["data.id"] ?? query.id ?? 0)
		if (id && type === "payment") processPaymentId(id).catch(console.error)
		else if (id && type === "merchant_order") processIPNTopic(type, id).catch(console.error)
		return new Response("OK", { status: 200 })
	}

	// Handle via JSON body (Webhook panel style: {"type":"payment","data":{"id":"..."}})
	const bodyText = await request.text().catch(() => "")
	if (bodyText) {
		console.log("[MP] Webhook body:", bodyText)
		let notification: { type?: string; action?: string; data?: { id?: number | string } }
		try {
			notification = JSON.parse(bodyText)
		} catch {
			console.warn("[MP] Failed to parse webhook body as JSON")
			return new Response("OK", { status: 200 })
		}

		const type = notification.type ?? ""
		const dataId = notification.data?.id

		if (dataId) {
			const id = Number(dataId)
			if (id && type === "payment") {
				console.log("[MP] JSON webhook — payment id:", id)
				processPaymentId(id).catch(console.error)
			} else if (id && type === "merchant_order") {
				console.log("[MP] JSON webhook — merchant_order id:", id)
				processIPNTopic(type, id).catch(console.error)
			} else {
				console.log("[MP] JSON webhook — unhandled type:", type, "data.id:", dataId)
			}
		} else {
			console.log("[MP] JSON webhook — no data.id found, type:", type)
		}

		return new Response("OK", { status: 200 })
	}

	console.log("[MP] No query params and empty body, returning 200")
	return new Response("OK", { status: 200 })
}
