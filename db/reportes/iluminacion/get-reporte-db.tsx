import { delay } from "#/lib/utils"
import { reportes_iluminacion } from "./schema"
import { eq, and } from "drizzle-orm"
import { db } from "../../"

export async function getReporteDB(userId: string, id: string) {
	try {
		await delay()
		return await db
			.select()
			.from(reportes_iluminacion)
			.where(
				and(
					eq(reportes_iluminacion.id, id),
					eq(reportes_iluminacion.userId, userId)
				)
			)
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo reporte:",
			error instanceof Error ? error.message : error
		)
	}
}
