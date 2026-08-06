import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createTecnicoDB } from "../../db/tecnicos/create-tecnico-db"
import { tecnicoFormValidator } from "../../db/tecnicos/tecnico-validator"
import { db } from "../../db"
import { tecnicos } from "../../db/tecnicos/schema"
import { eq, and, isNotNull } from "drizzle-orm"

export const createTecnicoServer = createServerFn({ method: "POST" })
	.validator(tecnicoFormValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const dniNum = Number(data.dni)
		const existing = await db
			.select({ id: tecnicos.id })
			.from(tecnicos)
			.where(and(eq(tecnicos.dni, dniNum), isNotNull(tecnicos.dni)))

		if (existing.length > 0) {
			throw new Error("El DNI ya está registrado")
		}

		const newTecnico = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			dni: dniNum,
		}

		const result = await createTecnicoDB(newTecnico)
		if (!result) {
			throw new Error("Failed to create técnico")
		}
		return result[0]
	})
