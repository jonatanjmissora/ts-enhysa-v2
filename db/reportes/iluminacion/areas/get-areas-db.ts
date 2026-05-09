import { eq } from "drizzle-orm"
import { delay } from "@/lib/utils"
import { db } from "../../../../db"
import { areas_iluminacion } from "./schema"

export async function getAreasDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(areas_iluminacion)
			.where(eq(areas_iluminacion.userId, userId))
	} catch (error) {
		console.error(
			"ERROR obteniendo areas de iluminacion:",
			error instanceof Error ? error.message : error
		)
	}
}
