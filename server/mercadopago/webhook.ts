import crypto from "node:crypto"
import { syncPayment, findPaymentIdFromMerchantOrder } from "./sync-payment"

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
	console.log("[MP] Webhook received:", request.method, url.pathname, url.search)

	const query = Object.fromEntries(url.searchParams)

	// IPN via query params (?topic=payment&id=... or ?type=payment&data.id=...)
	if (query.type || query.topic) {
		const type = query.type ?? query.topic ?? ""
		const id = Number(query["data.id"] ?? query.id ?? 0)
		if (id && type === "payment") syncPayment(id).catch(console.error)
		else if (id && type === "merchant_order") {
			findPaymentIdFromMerchantOrder(id).then(paymentId => {
				if (paymentId) syncPayment(paymentId).catch(console.error)
			}).catch(console.error)
		}
		return new Response("OK", { status: 200 })
	}

	// Webhook via JSON body
	const bodyText = await request.text().catch(() => "")
	if (bodyText) {
		if (!validateSignature(request.headers, bodyText)) {
			console.log("[MP] Invalid signature")
			return new Response("Invalid signature", { status: 401 })
		}

		try {
			const notification = JSON.parse(bodyText)
			const type = notification.type ?? ""
			const dataId = notification.data?.id
			if (dataId && type === "payment") {
				syncPayment(Number(dataId)).catch(console.error)
			} else if (dataId && type === "merchant_order") {
				findPaymentIdFromMerchantOrder(Number(dataId)).then(paymentId => {
					if (paymentId) syncPayment(paymentId).catch(console.error)
				}).catch(console.error)
			}
		} catch { /* ignore parse errors */ }

		return new Response("OK", { status: 200 })
	}

	return new Response("OK", { status: 200 })
}
