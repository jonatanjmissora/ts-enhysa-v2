import type { EmpresaType } from "../../db/empresas/schema"
import { localDb } from "../database"

export async function getEmpresasLocal(userId: string) {
	const empresas = await localDb.empresas.where("userId").equals(userId).toArray()
	return empresas.length > 0 ? empresas : null
}

export async function getEmpresaLocal(id: string) {
	return (await localDb.empresas.get(id)) ?? null
}

export async function saveEmpresasLocal(empresas: EmpresaType[]) {
	await localDb.empresas.bulkPut(empresas)
	return { data: empresas, status: "ok" }
}
