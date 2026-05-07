import { eq } from "drizzle-orm"
import { delay } from "@/lib/utils"
import { db } from "../.."
import { reportes_iluminacion } from "./schema"

export async function getReportesDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(reportes_iluminacion)
			.where(eq(reportes_iluminacion.userId, userId))
	} catch (error) {
		console.error(
			"ERROR obteniendo reportes de iluminacion:",
			error instanceof Error ? error.message : error
		)
	}
}
