import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getAreasDB } from "../../../../db/reportes/iluminacion/areas/get-areas-db"

export const getAreasServer = createServerFn()
	.inputValidator((data: { reporteId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		return await getAreasDB(session.user.id, data.reporteId)
	})
