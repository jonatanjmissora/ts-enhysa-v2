import { db } from ".."
import { empresas } from "./schema"
import { and, eq, asc, isNull } from "drizzle-orm"
import { delay } from "@/lib/utils"

export async function getEmpresasDB(userId: string) {
	try {
		await delay()
		return await db
			.select()
			.from(empresas)
			.where(and(eq(empresas.userId, userId), isNull(empresas.deletedAt)))
			.orderBy(asc(empresas.razonSocial))
	} catch (error) {
		console.error(
			"ERROR obteniendo empresas:",
			error instanceof Error ? error.message : error
		)
	}
}
