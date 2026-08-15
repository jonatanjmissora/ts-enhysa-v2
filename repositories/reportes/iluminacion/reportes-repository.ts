import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import type { EmpresaType } from "../../../db/empresas/schema"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import {
	getEmpresaLocal,
	saveEmpresasLocal,
} from "../../../indexed-db/empresas/empresas-local-db"
import {
	getInstrumentoLocal,
	saveInstrumentosLocal,
} from "../../../indexed-db/instrumentos/instrumentos-local-db"
import {
	getReporteLocal,
	getReportesLocal,
	saveReportesLocal,
} from "../../../indexed-db/reportes/iluminacion/reportes-local-db"
import {
	getTecnicoByIdLocal,
	saveTecnicoLocal,
} from "../../../indexed-db/tecnicos/tecnico-local-db"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"

type ReporteConRelaciones = ReporteIluminacionType & {
	empresa: EmpresaType | null
	tecnico: TecnicoType | null
	instrumento: InstrumentoType | null
}

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

	async getById(id: string): Promise<ReporteConRelaciones | null | undefined> {
		if (typeof window === "undefined") {
			return await getReporteServer({ data: { id } })
		}

		const reporteL = await getReporteLocal(id)

		if (reporteL) {
			console.log("[IndexedDB] Reporte iluminación local:", reporteL)
			const [empresa, tecnico, instrumento] = await Promise.all([
				getEmpresaLocal(reporteL.empresaId),
				getTecnicoByIdLocal(reporteL.tecnicoId),
				getInstrumentoLocal(reporteL.instrumentoId),
			])

			if (empresa && tecnico && instrumento) {
				return {
					...reporteL,
					empresa,
					tecnico,
					instrumento,
				}
			}

			// Falta alguna relación en caché: sanar desde el server cuando hay conexión
			console.warn(
				"[IndexedDB] Relación faltante en caché, sanando desde server:",
				{ empresa: !!empresa, tecnico: !!tecnico, instrumento: !!instrumento }
			)
			const reporteR = await getReporteServer({ data: { id } })

			if (reporteR) {
				const {
					empresa: e,
					tecnico: t,
					instrumento: i,
					...base
				} = reporteR
				await saveReportesLocal([base])
				if (e) await saveEmpresasLocal([e])
				if (t) await saveTecnicoLocal(t)
				if (i) await saveInstrumentosLocal([i])
				return reporteR
			}

			// Sin conexión: devolver lo que hay (relación puede ser null)
			return {
				...reporteL,
				empresa,
				tecnico,
				instrumento,
			}
		}

		const reporteR = await getReporteServer({ data: { id } })

		if (reporteR) {
			console.log("[API] Reporte iluminación remoto:", reporteR)
			const { empresa: _e, tecnico: _t, instrumento: _i, ...base } = reporteR
			await saveReportesLocal([base])
		}

		return reporteR
	},
}
