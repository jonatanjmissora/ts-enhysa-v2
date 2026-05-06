import { delay } from "@/lib/utils"
import { db } from ".."
import { instrumentos } from "./schema"
import { eq } from "drizzle-orm"
import type { UpdateInstrumentoType } from "./instrumento-validator"

export async function updateInstrumentoDB(
	updatedInstrumento: UpdateInstrumentoType
) {
	try {
		await delay()
		const result = await db
			.update(instrumentos)
			.set(updatedInstrumento)
			.where(eq(instrumentos.id, updatedInstrumento.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando instrumento:",
			error instanceof Error ? error.message : error
		)
	}
}
