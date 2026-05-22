import { delay } from "@/lib/utils"
import { reportes_iluminacion, type ReporteIluminacionType } from "./schema"
import { db } from "../.."

export async function createReporteNuevoDB(newReport: ReporteIluminacionType) {
	try {
		await delay()
		return await db.insert(reportes_iluminacion).values(newReport).returning()
	} catch (error) {
		console.error(
			"ERROR insertando reporte:",
			error instanceof Error ? error.message : error
		)
	}
}
