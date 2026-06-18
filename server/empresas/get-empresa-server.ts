import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getEmpresaDB } from "../../db/empresas/get-empresa-db"
import { protectedServerFn } from "@/lib/protected-server-fn"

export const getEmpresaServer = createServerFn()
	.validator((data: { id: string; tecnicoId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		await protectedServerFn(request)

		return await getEmpresaDB(data.id, data.tecnicoId)
	})
