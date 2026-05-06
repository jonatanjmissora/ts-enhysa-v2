import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateTecnicoValidator } from "../../db/tecnicos/tecnico-validator"
import { updateTecnicoDB } from "../../db/tecnicos/update-tecnico-db"

export const updateTecnicoServer = createServerFn({ method: "POST" })
	.inputValidator(updateTecnicoValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateTecnicoDB(data)
	})
