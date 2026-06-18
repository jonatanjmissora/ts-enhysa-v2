import { delay } from "#/lib/utils"
import { db } from "../../.."
import { eq } from "drizzle-orm"
import { localizadas_iluminacion } from "./schema"

export async function getLocalizadaDB(localizadaId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(localizadas_iluminacion)
			.where(eq(localizadas_iluminacion.id, localizadaId))
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo localizada:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
