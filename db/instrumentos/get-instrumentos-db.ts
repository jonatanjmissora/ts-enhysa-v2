import { db } from ".."
import { instrumentos } from "./schema"
import { eq, asc } from "drizzle-orm"
import { delay } from "@/lib/utils"

export async function getInstrumentosDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(instrumentos)
			.where(eq(instrumentos.userId, userId))
			.orderBy(asc(instrumentos.nombre))
	} catch (error) {
		console.error(
			"ERROR obteniendo instrumental:",
			error instanceof Error ? error.message : error
		)
	}
}
