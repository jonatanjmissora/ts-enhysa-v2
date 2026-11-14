import { delay } from "@/lib/utils"
import { db } from ".."
import type { InstrumentoFormType } from "./instrumento-validator"
import { instrumentos } from "./schema"

export async function createInstrumentoDB(
	newInstrumento: InstrumentoFormType & { id: string; userId: string }
) {
	try {
		await delay()
		return await db
			.insert(instrumentos)
			.values({
				...newInstrumento,
				deletedAt: null,
				updatedAt: new Date(),
			})
			.returning()
	} catch (error) {
		console.error(
			"ERROR insertando instrumental:",
			error instanceof Error ? error.message : error
		)
	}
}
