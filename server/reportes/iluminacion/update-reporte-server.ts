import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { updateReporteDB } from "../../../db/reportes/iluminacion/update-reporte-db"
import { updateReporteServerValidator } from "../../../db/reportes/iluminacion/reporte-validator"

export const updateReporteServer = createServerFn({ method: "POST" })
	.validator(updateReporteServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		if (session.user.id !== data.userId) {
			throw new Response("Unauthorized", { status: 401 })
		}

		return await updateReporteDB({
			...data,
			finishedAt: data.finishedAt || null,
		})
	})
