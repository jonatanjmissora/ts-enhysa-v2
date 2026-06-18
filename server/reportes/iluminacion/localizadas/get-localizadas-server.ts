import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getLocalizadasDB } from "../../../../db/reportes/iluminacion/localizadas/get-localizadas-db"

export const getLocalizadasServer = createServerFn()
	.validator((data: { reportId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		return await getLocalizadasDB(session.user.id, data.reportId)
	})
