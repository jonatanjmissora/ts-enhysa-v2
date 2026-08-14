import type { LocalizadaIluminacionType } from "../../../db/reportes/iluminacion/localizadas/schema"
import {
	getLocalizadasLocal,
	saveLocalizadasLocal,
} from "../../../indexed-db/reportes/iluminacion/localizadas/localizadas-local-db"
import { getLocalizadasServer } from "../../../server/reportes/iluminacion/localizadas/get-localizadas-server"

export const localizadasRepository = {
	async get(
		reportId: string
	): Promise<LocalizadaIluminacionType[] | null | undefined> {
		if (typeof window === "undefined") {
			return await getLocalizadasServer({ data: { reportId } })
		}

		const localizadasL = await getLocalizadasLocal(reportId)

		if (localizadasL) {
			console.log("[IndexedDB] Localizadas iluminación local:", localizadasL)
			return localizadasL
		}

		const localizadasR = await getLocalizadasServer({ data: { reportId } })

		if (localizadasR) {
			console.log("[API] Localizadas iluminación remotas:", localizadasR)
			const res = await saveLocalizadasLocal(localizadasR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Localizadas iluminación guardadas:", res.data)
			}
		}

		return localizadasR
	},
}
