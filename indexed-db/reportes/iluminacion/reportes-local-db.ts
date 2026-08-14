import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { localDb } from "../../database"

export async function getReportesLocal(userId: string) {
	const reportes = await localDb.reportesIluminacion
		.where("userId")
		.equals(userId)
		.toArray()

	return reportes.length > 0 ? reportes : null
}

export async function saveReportesLocal(reportes: ReporteIluminacionType[]) {
	await localDb.reportesIluminacion.bulkPut(reportes)
	return { data: reportes, status: "ok" }
}
