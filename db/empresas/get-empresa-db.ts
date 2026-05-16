import { delay } from "@/lib/utils"
import { db } from ".."
import { eq, and } from "drizzle-orm"
import { empresas } from "./schema"

export async function getEmpresaDB(id: string, userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(empresas)
			.where(and(eq(empresas.id, id), eq(empresas.userId, userId)))
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo empresa:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
