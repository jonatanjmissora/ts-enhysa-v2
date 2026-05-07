import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getReporteNuevoDB } from "../../../db/reportes/iluminacion/get-reporte-nuevo-db"

export const getReporteNuevoServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	return await getReporteNuevoDB(session.user.id)
})
