import { delay } from "@/lib/utils"
import { db } from "../../.."
import {
	localizadas_iluminacion,
	type LocalizadaIluminacionType,
} from "./schema"

export async function createLocalizadaDB(
	newLocalizada: LocalizadaIluminacionType
) {
	try {
		await delay()
		return await db
			.insert(localizadas_iluminacion)
			.values(newLocalizada)
			.returning()
	} catch (error) {
		console.error(
			"ERROR insertando localizada:",
			error instanceof Error ? error.message : error
		)
	}
}
