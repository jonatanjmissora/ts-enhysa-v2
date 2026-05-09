import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateReporteNuevoDB } from "../../../db/reportes/iluminacion/update-reporte-nuevo-db"
import { updateReporteValidator } from "../../../db/reportes/iluminacion/reporte-validator"

export const updateReporteNuevoServer = createServerFn({ method: "POST" })
	.inputValidator(updateReporteValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateReporteNuevoDB({
			...data,
			areasId: data.areasId || null,
			observacion: data.observacion || null,
			conclusion: data.conclusion || null,
			recomendacion: data.recomendacion || null,
			createdAt: data.createdAt || new Date(),
			finishedAt: data.finishedAt || null,
		})
	})
