import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateReporteNuevoDB } from "../../../db/reportes/iluminacion/update-reporte-nuevo-db"
import { updateReporteNuevoServerValidator } from "../../../db/reportes/iluminacion/reporte-validator"

export const updateReporteNuevoServer = createServerFn({ method: "POST" })
	.inputValidator(updateReporteNuevoServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateReporteNuevoDB({
			...data,
			finishedAt: data.finishedAt || null,
		})
	})
