import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import { localDb } from "../../../database"

export async function getLocalizadasLocal(reportId: string) {
	const localizadas = await localDb.localizadasIluminacion
		.where("reportId")
		.equals(reportId)
		.toArray()

	return localizadas.length > 0 ? localizadas : null
}

export async function saveLocalizadasLocal(
	localizadas: LocalizadaIluminacionType[]
) {
	await localDb.localizadasIluminacion.bulkPut(localizadas)
	return { data: localizadas, status: "ok" }
}
