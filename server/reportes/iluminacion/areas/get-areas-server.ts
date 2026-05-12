import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getAreasDB } from "../../../../db/reportes/iluminacion/areas/get-areas-db"
import { getReporteNuevoDB } from "../../../../db/reportes/iluminacion/get-reporte-nuevo-db"

export const getAreasServer = createServerFn().handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)

	const report = await getReporteNuevoDB(session.user.id)
	if (!report) return []

	return await getAreasDB(session.user.id, report.id)
})
