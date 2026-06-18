import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { deleteEmpresaDB } from "../../db/empresas/delete-empresa-db"
import { protectedServerFn } from "@/lib/protected-server-fn"
import { empresaIdValidator } from "../../db/empresas/empresa-validator"

export const deleteEmpresaServer = createServerFn({ method: "POST" })
	.validator(empresaIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteEmpresaDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Empresa not found or could not be deleted")
		}

		return result
	})
