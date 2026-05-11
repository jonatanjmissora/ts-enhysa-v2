import { delay } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { areas_iluminacion, type AreaIluminacionType } from "./schema"
import { db } from "../../.."

export async function updateAreaDB(updatedArea: AreaIluminacionType) {
	try {
		await delay()
		const result = await db
			.update(areas_iluminacion)
			.set(updatedArea)
			.where(eq(areas_iluminacion.id, updatedArea.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando area:",
			error instanceof Error ? error.message : error
		)
	}
}
