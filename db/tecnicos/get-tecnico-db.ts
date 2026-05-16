import { tecnicos } from "../tecnicos/schema"
import { eq } from "drizzle-orm"
import { delay } from "@/lib/utils"
import { db } from ".."

export async function getTecnicoDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(tecnicos)
			.where(eq(tecnicos.userId, userId))
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR obteniendo tecnico:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
