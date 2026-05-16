import { delay } from "#/lib/utils"
import { reportes_iluminacion } from "./schema"
import { eq, and } from "drizzle-orm"
import { db } from "../../"

export async function getReporteDB(userId: string, id: string) {
	try {
		await delay()
		const result = await db.query.reportes_iluminacion.findFirst({
			where: and(
				eq(reportes_iluminacion.id, id),
				eq(reportes_iluminacion.userId, userId)
			),
			with: {
				empresa: true,
				instrumento: true,
				tecnico: true,
			},
		})
		return result ?? null
	} catch (error) {
		console.error(
			"ERROR leyendo reporte:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
