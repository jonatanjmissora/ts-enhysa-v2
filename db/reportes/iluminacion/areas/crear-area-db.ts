import { delay } from "@/lib/utils"
import { db } from "../../.."
import { areas_iluminacion, type AreaIluminacionType } from "./schema"

export async function createAreaDB(newArea: AreaIluminacionType) {
	try {
		await delay()
		return await db.insert(areas_iluminacion).values(newArea).returning()
	} catch (error) {
		console.error(
			"ERROR insertando area de iluminacion:",
			error instanceof Error ? error.message : error
		)
	}
}
