import { delay } from "@/lib/utils"
import { db } from "../.."
import { reportes_iluminacion } from "./schema"
import { and, eq } from "drizzle-orm"

export async function deleteReporteDB(id: string, userId: string) {
	try {
		await delay()
		return await db
			.delete(reportes_iluminacion)
			.where(
				and(
					eq(reportes_iluminacion.id, id),
					eq(reportes_iluminacion.userId, userId)
				)
			)
			.returning()
	} catch (error) {
		console.error(
			"ERROR eliminando reporte:",
			error instanceof Error ? error.message : error
		)
	}
}
