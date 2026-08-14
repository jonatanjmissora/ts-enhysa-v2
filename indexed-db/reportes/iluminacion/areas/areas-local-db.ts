import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import { localDb } from "../../../database"

export async function getAreasLocal(reportId: string) {
	const areas = await localDb.areasIluminacion.where("reportId").equals(reportId).toArray()

	return areas.length > 0 ? areas : null
}

export async function saveAreasLocal(areas: AreaIluminacionType[]) {
	await localDb.areasIluminacion.bulkPut(areas)
	return { data: areas, status: "ok" }
}
