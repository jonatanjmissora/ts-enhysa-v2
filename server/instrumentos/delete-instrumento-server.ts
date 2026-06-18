import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { deleteInstrumentoDB } from "../../db/instrumentos/delete-instrumento-db"
import { instrumentoIdValidator } from "../../db/instrumentos/instrumento-validator"

export const deleteInstrumentoServer = createServerFn({ method: "POST" })
	.validator(instrumentoIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteInstrumentoDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Instrumento not found or could not be deleted")
		}

		return result
	})
