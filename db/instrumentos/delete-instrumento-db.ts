import { delay } from "@/lib/utils"
import { db } from ".."
import { instrumentos } from "./schema"
import { and, eq } from "drizzle-orm"

export async function deleteInstrumentoDB(id: string, userId: string) {
	try {
		await delay()
		return await db
			.delete(instrumentos)
			.where(and(eq(instrumentos.id, id), eq(instrumentos.userId, userId)))
			.returning()
	} catch (error) {
		console.error(
			"ERROR eliminando instrumento:",
			error instanceof Error ? error.message : error
		)
	}
}
