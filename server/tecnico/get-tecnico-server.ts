import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getTecnicoDB } from "../../db/tecnicos/get-tecnico-db"

export const getTecnicoServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getTecnicoDB(session.user.id)
})
