import { delay } from "@/lib/utils"
import { db } from ".."
import { instrumentos, type InstrumentoType } from "./schema"

export async function createInstrumentoDB(newInstrumento: InstrumentoType) {
	try {
		await delay()
		return await db.insert(instrumentos).values(newInstrumento).returning()
	} catch (error) {
		console.error(
			"ERROR insertando instrumental:",
			error instanceof Error ? error.message : error
		)
	}
}
