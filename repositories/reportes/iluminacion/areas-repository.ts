import type { AreaIluminacionType } from "../../../db/reportes/iluminacion/areas/schema"
import {
	getAreasLocal,
	saveAreasLocal,
} from "../../../indexed-db/reportes/iluminacion/areas/areas-local-db"
import { getAreasServer } from "../../../server/reportes/iluminacion/areas/get-areas-server"

export const areasRepository = {
	async get(reportId: string): Promise<AreaIluminacionType[] | null | undefined> {
		if (typeof window === "undefined") {
			return await getAreasServer({ data: { reportId } })
		}

		const areasL = await getAreasLocal(reportId)

		if (areasL) {
			console.log("[IndexedDB] Areas iluminación local:", areasL)
			return areasL
		}

		const areasR = await getAreasServer({ data: { reportId } })

		if (areasR) {
			console.log("[API] Areas iluminación remotas:", areasR)
			const res = await saveAreasLocal(areasR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Areas iluminación guardadas:", res.data)
			}
		}

		return areasR
	},
}
