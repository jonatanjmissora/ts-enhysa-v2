import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateEmpresaDB } from "../../db/empresas/update-empresa-db"
import { protectedServerFn } from "@/lib/protected-server-fn"
import { updateEmpresaValidator } from "../../db/empresas/empresa-validator"

export const updateEmpresaServer = createServerFn({ method: "POST" })
	.validator(updateEmpresaValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateEmpresaDB(data)
	})
