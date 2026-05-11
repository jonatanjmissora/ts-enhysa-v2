import { protectedServerFn } from "#/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateAreaDB } from "../../../../db/reportes/iluminacion/areas/update-area-db"
import { updateAreaValidator } from "../../../../db/reportes/iluminacion/areas/area-validator"

export const updateAreaServer = createServerFn({ method: "POST" })
	.inputValidator(updateAreaValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateAreaDB(data)
	})
