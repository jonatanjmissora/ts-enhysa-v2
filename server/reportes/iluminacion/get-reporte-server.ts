import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getReporteDB } from "../../../db/reportes/iluminacion/get-reporte-db"

export const getReporteServer = createServerFn()
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		return await getReporteDB(session.user.id, data.id)
	})
