import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateInstrumentoDB } from "../../db/instrumentos/update-instrumento-db"
import { updateInstrumentoValidator } from "../../db/instrumentos/instrumento-validator"

export const updateInstrumentoServer = createServerFn({ method: "POST" })
	.validator(updateInstrumentoValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateInstrumentoDB(data)
	})
