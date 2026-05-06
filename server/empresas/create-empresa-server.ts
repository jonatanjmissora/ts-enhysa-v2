import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createEmpresaDB } from "../../db/empresas/create-empresa-db"
import { empresaFormValidator } from "../../db/empresas/empresa-validator"

export const createEmpresaServer = createServerFn({ method: "POST" })
	.inputValidator(empresaFormValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const newEmpresa = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
		}

		const result = await createEmpresaDB(newEmpresa)
		if (!result) {
			throw new Error("Failed to create empresa")
		}
		return result[0]
	})
