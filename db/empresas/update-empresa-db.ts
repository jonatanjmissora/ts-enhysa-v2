import { delay } from "@/lib/utils"
import type { UpdateEmpresaType } from "./empresa-validator"
import { db } from ".."
import { empresas } from "./schema"
import { eq } from "drizzle-orm"

export async function updateEmpresaDB(updatedEmpresa: UpdateEmpresaType) {
	try {
		await delay()
		const result = await db
			.update(empresas)
			.set(updatedEmpresa)
			.where(eq(empresas.id, updatedEmpresa.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando técnico:",
			error instanceof Error ? error.message : error
		)
	}
}
