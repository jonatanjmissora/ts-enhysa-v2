import { delay } from "#/lib/utils"
import { db } from "../../.."
import { eq } from "drizzle-orm"
import { areas_iluminacion } from "./schema"

export async function getAreaDB(areaId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(areas_iluminacion)
			.where(eq(areas_iluminacion.id, areaId))
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo area:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
