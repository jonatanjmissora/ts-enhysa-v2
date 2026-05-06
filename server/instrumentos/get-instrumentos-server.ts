import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getInstrumentosDB } from "../../db/instrumentos/get-instrumentos-db"

export const getInstrumentosServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getInstrumentosDB(session.user.id)
})
