import { delay } from "@/lib/utils"
import { and, eq } from "drizzle-orm"
import { db } from "../../.."
import { localizadas_iluminacion } from "./schema"

export async function deleteLocalizadaDB(id: string, userId: string) {
	try {
		await delay()
		return await db
			.delete(localizadas_iluminacion)
			.where(
				and(
					eq(localizadas_iluminacion.id, id),
					eq(localizadas_iluminacion.userId, userId)
				)
			)
			.returning()
	} catch (error) {
		console.error(
			"ERROR eliminando localizada:",
			error instanceof Error ? error.message : error
		)
	}
}
