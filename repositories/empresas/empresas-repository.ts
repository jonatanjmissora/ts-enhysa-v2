import type { EmpresaType } from "../../db/empresas/schema"
import {
	getEmpresasLocal,
	saveEmpresasLocal,
} from "../../indexed-db/empresas/empresas-local-db"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"

export const empresasRepository = {
	async get(userId: string): Promise<EmpresaType[] | null | undefined> {
		if (typeof window === "undefined") {
			return await getEmpresasServer()
		}

		const empresasL = await getEmpresasLocal(userId)

		if (empresasL) {
			console.log("[IndexedDB] Empresas local:", empresasL)
			return empresasL
		}

		const empresasR = await getEmpresasServer()

		if (empresasR) {
			console.log("[API] Empresas remotas:", empresasR)
			const res = await saveEmpresasLocal(empresasR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Empresas guardadas:", res.data)
			}
		}

		return empresasR
	},
}
