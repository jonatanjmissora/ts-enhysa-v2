import { delay } from "@/lib/utils"
import { tecnicos, type TecnicoType } from "./schema"
import { db } from ".."

export async function createTecnicoDB(newTecnico: TecnicoType) {
	try {
		await delay()
		return await db.insert(tecnicos).values(newTecnico).returning()
	} catch (error) {
		console.error(
			"ERROR insertando técnico:",
			error instanceof Error ? error.message : error
		)
	}
}
