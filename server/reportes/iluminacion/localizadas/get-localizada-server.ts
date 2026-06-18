import { protectedServerFn } from "#/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getLocalizadaDB } from "../../../../db/reportes/iluminacion/localizadas/get-localizada-db"

export const getLocalizadaServer = createServerFn()
	.validator((data: { localizadaId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		await protectedServerFn(request)

		return await getLocalizadaDB(data.localizadaId)
	})
