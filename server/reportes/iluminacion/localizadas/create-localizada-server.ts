import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { localizadaServerValidator } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import { createLocalizadaDB } from "../../../../db/reportes/iluminacion/localizadas/crear-localizada-db"

export const createLocalizadaServer = createServerFn({ method: "POST" })
	.validator(localizadaServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const newLocalizada = {
			...data,
			userId: session.user.id,
			observaciones: data.observaciones || "Sin Observaciones",
			imagenes: data.imagenes || [],
			valor: data.valor || 0,
			timestamps: data.timestamps || [],
		}

		const result = await createLocalizadaDB(newLocalizada)
		if (!result) {
			throw new Error("Failed to create area")
		}
		return result[0]
	})
