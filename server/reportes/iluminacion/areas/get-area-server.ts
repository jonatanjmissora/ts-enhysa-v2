import { protectedServerFn } from "#/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getAreaDB } from "../../../../db/reportes/iluminacion/areas/get-area-db"

export const getAreaServer = createServerFn()
	.inputValidator((data: { areaId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		await protectedServerFn(request)

		return await getAreaDB(data.areaId)
	})
