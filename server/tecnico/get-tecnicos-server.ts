import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getTecnicosDB } from "../../db/tecnicos/get-tecnicos-db"

export const getTecnicosServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getTecnicosDB(session.user.id)
})
