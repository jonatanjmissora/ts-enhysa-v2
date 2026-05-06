import { delay } from "@/lib/utils"
import { db } from ".."
import { empresas, type EmpresaType } from "./schema"

export async function createEmpresaDB(newEmpresa: EmpresaType) {
	try {
		await delay()
		return await db.insert(empresas).values(newEmpresa).returning()
	} catch (error) {
		console.error(
			"ERROR insertando empresa:",
			error instanceof Error ? error.message : error
		)
	}
}
