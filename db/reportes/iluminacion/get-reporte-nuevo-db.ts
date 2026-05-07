import { delay } from "@/lib/utils"
import { db } from "../../"
import { eq, and, isNull } from "drizzle-orm"
import { reportes_iluminacion } from "./schema"

export async function getReporteNuevoDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(reportes_iluminacion)
			.where(
				and(
					isNull(reportes_iluminacion.finishedAt),
					eq(reportes_iluminacion.userId, userId)
				)
			)
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo instrumento:",
			error instanceof Error ? error.message : error
		)
	}
}
