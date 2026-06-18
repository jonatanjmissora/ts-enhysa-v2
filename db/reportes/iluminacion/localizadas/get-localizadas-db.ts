import { and, eq } from "drizzle-orm"
import { delay } from "@/lib/utils"
import { db } from "../../.."
import { localizadas_iluminacion } from "./schema"

export async function getLocalizadasDB(userId: string, reportId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(localizadas_iluminacion)
			.where(
				and(
					eq(localizadas_iluminacion.userId, userId),
					eq(localizadas_iluminacion.reportId, reportId)
				)
			)
	} catch (error) {
		console.error(
			"ERROR obteniendo localizadas de iluminacion:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}
