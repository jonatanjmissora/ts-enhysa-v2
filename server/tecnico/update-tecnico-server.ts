import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateTecnicoValidator } from "../../db/tecnicos/tecnico-validator"
import { updateTecnicoDB } from "../../db/tecnicos/update-tecnico-db"
import { db } from "../../db"
import { tecnicos } from "../../db/tecnicos/schema"
import { eq, and, ne, isNotNull } from "drizzle-orm"

export const updateTecnicoServer = createServerFn({ method: "POST" })
	.validator(updateTecnicoValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		const dniNum = Number(data.dni)
		const existing = await db
			.select({ id: tecnicos.id })
			.from(tecnicos)
			.where(
				and(
					eq(tecnicos.dni, dniNum),
					ne(tecnicos.id, data.id),
					isNotNull(tecnicos.dni)
				)
			)

		if (existing.length > 0) {
			throw new Error("El DNI ya está registrado")
		}

		return await updateTecnicoDB(data)
	})
