import { delay } from "@/lib/utils"
import { eq } from "drizzle-orm"
import {
	localizadas_iluminacion,
	type LocalizadaIluminacionType,
} from "./schema"
import { db } from "../../.."

export async function updateLocalizadaDB(
	updatedLocalizada: LocalizadaIluminacionType
) {
	try {
		await delay()
		const result = await db
			.update(localizadas_iluminacion)
			.set(updatedLocalizada)
			.where(eq(localizadas_iluminacion.id, updatedLocalizada.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando localizada:",
			error instanceof Error ? error.message : error
		)
	}
}
