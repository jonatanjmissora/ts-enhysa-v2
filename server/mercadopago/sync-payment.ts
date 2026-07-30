import { Payment, MercadoPagoConfig } from "mercadopago"
import { db } from "../../db"
import { pendingPayments } from "../../db/payments/schema"
import { userCredits, creditHistory } from "../../db/credits/schema"
import { eq, and, isNull, sql } from "drizzle-orm"
import { randomUUID } from "node:crypto"

export const CREDIT_MAP: Record<string, number> = {
	"por informe": 1,
	mensual: 7,
	anual: 100,
}

function getClient() {
	const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
	if (!accessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN not set")
	return new MercadoPagoConfig({ accessToken })
}

export async function verifyPayment(paymentId: number) {
	const payment = new Payment(getClient())
	return await payment.get({ id: paymentId })
}

export async function findPaymentIdFromMerchantOrder(merchantOrderId: number): Promise<number | null> {
	const { MerchantOrder } = await import("mercadopago")
	const merchantOrder = new MerchantOrder(getClient())
	const order = await merchantOrder.get({ merchantOrderId })
	const payment = order.payments?.find(p => p.status === "approved")
	return payment?.id ?? null
}

async function creditUser(paymentId: number, userId: string, planId: string) {
	const credits = CREDIT_MAP[planId]
	if (!credits) return false

	const inserted = await db.transaction(async (tx) => {
		const rows = await tx
			.insert(creditHistory)
			.values({
				id: randomUUID(),
				userId,
				type: "purchase",
				credits,
				paymentId: String(paymentId),
			})
			.onConflictDoNothing({ target: [creditHistory.paymentId, creditHistory.type] })
			.returning({ id: creditHistory.id })

		if (rows.length === 0) return false

		await tx
			.insert(userCredits)
			.values({ userId, credits })
			.onConflictDoUpdate({
				target: userCredits.userId,
				set: { credits: sql`${userCredits.credits} + ${credits}` },
			})

		return true
	})

	if (inserted) {
		console.log(`[MP] Credited ${credits} credits to user ${userId} (payment ${paymentId})`)
	}

	return inserted
}

async function updatePendingForPayment(paymentId: number, userId: string, status: "approved" | "rejected") {
	const paymentIdStr = String(paymentId)

	const existing = await db
		.update(pendingPayments)
		.set({ status, updatedAt: new Date() })
		.where(eq(pendingPayments.mpPaymentId, paymentIdStr))
		.returning({ id: pendingPayments.preferenceId })

	if (existing.length > 0) return

	await db
		.update(pendingPayments)
		.set({ mpPaymentId: paymentIdStr, status, updatedAt: new Date() })
		.where(
			and(
				eq(pendingPayments.userId, userId),
				eq(pendingPayments.status, "pending"),
				isNull(pendingPayments.mpPaymentId),
			),
		)
}

export async function syncPayment(paymentId: number): Promise<{ status: string; credits?: number }> {
	let payment
	try {
		payment = await verifyPayment(paymentId)
	} catch (err) {
		console.error("[MP] Error verifying payment", paymentId, err)
		return { status: "error" }
	}

	if (payment.status === "approved") {
		const userId = String(payment.external_reference ?? "")
		if (!userId) return { status: "error" }

		const planId = String(
			payment.metadata?.plan_id ??
			payment.additional_info?.items?.[0]?.id ??
			"",
		).toLowerCase()

		const planCredits = CREDIT_MAP[planId] ?? 0
		await creditUser(paymentId, userId, planId)
		await updatePendingForPayment(paymentId, userId, "approved")
		return { status: "approved", credits: planCredits }
	}

	if (payment.status === "rejected" || payment.status === "cancelled") {
		const userId = String(payment.external_reference ?? "")
		if (userId) await updatePendingForPayment(paymentId, userId, "rejected")
		return { status: payment.status }
	}

	return { status: payment.status ?? "unknown" }
}
