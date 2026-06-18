import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { protectedServerFn } from "#/lib/protected-server-fn"
import { localizadaIdValidator } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import { deleteLocalizadaDB } from "../../../../db/reportes/iluminacion/localizadas/delete-localizada"

export const deleteLocalizadaServer = createServerFn({ method: "POST" })
	.validator(localizadaIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteLocalizadaDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Localizada not found or could not be deleted")
		}

		return result
	})
