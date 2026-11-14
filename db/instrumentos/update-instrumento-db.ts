import { delay } from "@/lib/utils"
import { db } from ".."
import { instrumentos } from "./schema"
import { and, eq, isNull } from "drizzle-orm"
import type { UpdateInstrumentoType } from "./instrumento-validator"

export async function updateInstrumentoDB(
	updatedInstrumento: UpdateInstrumentoType
) {
	try {
		await delay()
		const result = await db
			.update(instrumentos)
			.set(updatedInstrumento)
			.where(
				and(
					eq(instrumentos.id, updatedInstrumento.id),
					eq(instrumentos.userId, updatedInstrumento.userId),
					isNull(instrumentos.deletedAt)
				)
			)
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando instrumento:",
			error instanceof Error ? error.message : error
		)
	}
}
