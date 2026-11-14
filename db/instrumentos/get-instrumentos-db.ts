import { db } from ".."
import { instrumentos } from "./schema"
import { and, eq, asc, isNull } from "drizzle-orm"
import { delay } from "@/lib/utils"

export async function getInstrumentosDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(instrumentos)
			.where(and(eq(instrumentos.userId, userId), isNull(instrumentos.deletedAt)))
			.orderBy(asc(instrumentos.nombre))
	} catch (error) {
		console.error(
			"ERROR obteniendo instrumental:",
			error instanceof Error ? error.message : error
		)
	}
}
