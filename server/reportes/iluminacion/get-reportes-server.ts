import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getReportesDB } from "../../../db/reportes/iluminacion/get-reportes-db"

export const getReportesServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getReportesDB(session.user.id)
})
