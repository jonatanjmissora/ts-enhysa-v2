import { db } from "../../db"
import { pendingPayments } from "../../db/payments/schema"
import { syncPayment } from "./sync-payment"
import { eq, and, isNotNull } from "drizzle-orm"

export async function syncPendingPayments(userId: string) {
	const pendings = await db
		.select()
		.from(pendingPayments)
		.where(
			and(
				eq(pendingPayments.userId, userId),
				eq(pendingPayments.status, "pending"),
				isNotNull(pendingPayments.mpPaymentId),
			),
		)

	if (pendings.length === 0) return { synchronized: false, pending: 0 }

	const results: { paymentId: number; status: string; credits?: number }[] = []
	for (const p of pendings) {
		if (!p.mpPaymentId) continue
		const result = await syncPayment(Number(p.mpPaymentId))
		results.push({ paymentId: Number(p.mpPaymentId), ...result })
	}

	const approved = results.filter(r => r.status === "approved").length
	return { synchronized: true, approved, pending: pendings.length - approved }
}
