import { delay } from "@/lib/utils"
import { db } from ".."
import { eq, and } from "drizzle-orm"
import { instrumentos } from "./schema"

export async function getInstrumentoDB(userId: string, instrumentoId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(instrumentos)
			.where(
				and(eq(instrumentos.id, instrumentoId), eq(instrumentos.userId, userId))
			)
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo instrumento:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
