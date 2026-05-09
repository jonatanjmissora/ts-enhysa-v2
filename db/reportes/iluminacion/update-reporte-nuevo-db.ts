import { delay } from "@/lib/utils"
import { db } from "../.."
import { eq } from "drizzle-orm"
import { reportes_iluminacion, type ReporteIluminacionType } from "./schema"

export async function updateReporteNuevoDB(
	updatedReporteNuevo: ReporteIluminacionType
) {
	try {
		await delay()
		const result = await db
			.update(reportes_iluminacion)
			.set(updatedReporteNuevo)
			.where(eq(reportes_iluminacion.id, updatedReporteNuevo.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando reporte nuevo:",
			error instanceof Error ? error.message : error
		)
	}
}
