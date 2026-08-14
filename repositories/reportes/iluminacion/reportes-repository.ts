import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import {
	getReportesLocal,
	saveReportesLocal,
} from "../../../indexed-db/reportes/iluminacion/reportes-local-db"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"

export const reportesRepository = {
	async get(userId: string): Promise<ReporteIluminacionType[] | null | undefined> {
		if (typeof window === "undefined") {
			return await getReportesServer()
		}

		const reportesL = await getReportesLocal(userId)

		if (reportesL) {
			console.log("[IndexedDB] Reportes iluminación local:", reportesL)
			return reportesL
		}

		const reportesR = await getReportesServer()

		if (reportesR) {
			console.log("[API] Reportes iluminación remotos:", reportesR)
			const res = await saveReportesLocal(reportesR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Reportes iluminación guardados:", res.data)
			}
		}

		return reportesR
	},
}
