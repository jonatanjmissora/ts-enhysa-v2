import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { reporteIluminacionIdValidator } from "../../../db/reportes/iluminacion/reporte-validator"
import { deleteReporteDB } from "../../../db/reportes/iluminacion/delete-reporte-db"

export const deleteReporteServer = createServerFn({ method: "POST" })
	.validator(reporteIluminacionIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteReporteDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Reporte not found or could not be deleted")
		}

		return result
	})
