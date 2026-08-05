import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createTecnicoDB } from "../../db/tecnicos/create-tecnico-db"
import { tecnicoFormValidator } from "../../db/tecnicos/tecnico-validator"

export const createTecnicoServer = createServerFn({ method: "POST" })
	.validator(tecnicoFormValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		const newTecnico = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			dni: Number(data.dni),
		}

		const result = await createTecnicoDB(newTecnico)
		if (!result) {
			throw new Error("Failed to create técnico")
		}
		return result[0]
	})
