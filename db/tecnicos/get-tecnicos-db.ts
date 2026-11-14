import { tecnicos } from "./schema"
import { and, desc, eq, isNull } from "drizzle-orm"
import { delay } from "@/lib/utils"
import { db } from ".."

export async function getTecnicosDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(tecnicos)
			.where(and(eq(tecnicos.userId, userId), isNull(tecnicos.deletedAt)))
			.orderBy(desc(tecnicos.updatedAt))
	} catch (error) {
		console.error(
			"ERROR obteniendo técnicos:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}
