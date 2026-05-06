import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getEmpresasDB } from "../../db/empresas/get-empresas-db"

export const getEmpresasServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getEmpresasDB(session.user.id)
})
