import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from "../../../db"
import { reportes_iluminacion } from "../../../db/reportes/iluminacion/schema"
import { userCredits, creditHistory } from "../../../db/credits/schema"
import { eq, and, sql } from "drizzle-orm"

export const unlockReporteServer = createServerFn({ method: "POST" })
	.validator((data: { reporteId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		const userId = session.user.id

		const reporte = await db
			.select({ creditConsumed: reportes_iluminacion.creditConsumed })
			.from(reportes_iluminacion)
			.where(eq(reportes_iluminacion.id, data.reporteId))
			.limit(1)

		if (reporte.length === 0) {
			throw new Error("Reporte no encontrado")
		}

		if (reporte[0].creditConsumed) {
			return { success: true }
		}

		return await db.transaction(async tx => {
			const result = await tx
				.update(userCredits)
				.set({ credits: sql`${userCredits.credits} - 1` })
				.where(
					and(
						eq(userCredits.userId, userId),
						sql`${userCredits.credits} > 0`,
					),
				)

			if (result.rowCount === 0) {
				throw new Error("Créditos insuficientes")
			}

			await tx
				.update(reportes_iluminacion)
				.set({
					creditConsumed: true,
					creditConsumedAt: new Date(),
				})
				.where(eq(reportes_iluminacion.id, data.reporteId))

			await tx.insert(creditHistory).values({
				id: crypto.randomUUID(),
				userId,
				type: "consume",
				credits: -1,
				reportId: data.reporteId,
				paymentId: null,
				createdAt: new Date(),
			})

			return { success: true }
		})
	})
