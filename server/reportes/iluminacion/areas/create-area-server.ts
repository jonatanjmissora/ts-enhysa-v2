import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { createAreaDB } from "../../../../db/reportes/iluminacion/areas/crear-area-db"
import { areaServerValidator } from "../../../../db/reportes/iluminacion/areas/area-validator"

export const createAreaServer = createServerFn({ method: "POST" })
	.inputValidator(areaServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const newArea = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			observaciones: data.observaciones || "Sin Observaciones",
			imagenes: data.imagenes || [],
			puntos: data.puntos || [],
			timestamps: data.timestamps || [],
		}

		const result = await createAreaDB(newArea)
		if (!result) {
			throw new Error("Failed to create area")
		}
		return result[0]
	})
