import { delay } from "@/lib/utils"
import { and, eq } from "drizzle-orm"
import { db } from "../../.."
import { areas_iluminacion } from "./schema"

export async function deleteAreaDB(id: string, userId: string) {
	try {
		await delay()
		return await db
			.delete(areas_iluminacion)
			.where(
				and(eq(areas_iluminacion.id, id), eq(areas_iluminacion.userId, userId))
			)
			.returning()
	} catch (error) {
		console.error(
			"ERROR eliminando area:",
			error instanceof Error ? error.message : error
		)
	}
}
