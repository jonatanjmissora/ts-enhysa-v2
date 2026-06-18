import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { areaIdValidator } from "../../../../db/reportes/iluminacion/areas/area-validator"
import { deleteAreaDB } from "../../../../db/reportes/iluminacion/areas/delete-area"
import { protectedServerFn } from "#/lib/protected-server-fn"

export const deleteAreaServer = createServerFn({ method: "POST" })
	.validator(areaIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteAreaDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Area not found or could not be deleted")
		}

		return result
	})
