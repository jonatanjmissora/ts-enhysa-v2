import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createInstrumentoDB } from "../../db/instrumentos/create-instrumento-db"
import { protectedServerFn } from "@/lib/protected-server-fn"
import { instrumentoFormValidator } from "../../db/instrumentos/instrumento-validator"

export const createInstrumentoServer = createServerFn({ method: "POST" })
	.inputValidator(instrumentoFormValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const newInstrumento = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
		}

		const result = await createInstrumentoDB(newInstrumento)
		if (!result) {
			throw new Error("Failed to create instrumento")
		}
		return result[0]
	})
