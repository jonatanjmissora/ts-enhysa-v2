import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { getInstrumentoDB } from "../../db/instrumentos/get-instrumento-db"

export const getInstrumentoServer = createServerFn()
	.validator((data: { id: string; tecnicoId: string }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		await protectedServerFn(request)

		return await getInstrumentoDB(data.id, data.tecnicoId)
	})
