import { delay } from "@/lib/utils"
import { db } from ".."
import type { EmpresaFormType } from "./empresa-validator"
import { empresas } from "./schema"

export async function createEmpresaDB(
	newEmpresa: EmpresaFormType & { id: string; userId: string }
) {
	try {
		await delay()
		return await db
			.insert(empresas)
			.values({ ...newEmpresa, deletedAt: null, updatedAt: new Date() })
			.returning()
	} catch (error) {
		console.error(
			"ERROR insertando empresa:",
			error instanceof Error ? error.message : error
		)
	}
}
