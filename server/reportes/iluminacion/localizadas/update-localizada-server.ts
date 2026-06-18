import { protectedServerFn } from "#/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateLocalizadaValidator } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import { updateLocalizadaDB } from "../../../../db/reportes/iluminacion/localizadas/update-localizada-db"

export const updateLocalizadaServer = createServerFn({ method: "POST" })
	.validator(updateLocalizadaValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateLocalizadaDB(data)
	})
