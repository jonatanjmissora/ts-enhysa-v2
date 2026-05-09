import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { reporteIluminacionIdValidator } from "../../../db/reportes/iluminacion/reporte-validator"
import { deleteReporteNuevoDB } from "../../../db/reportes/iluminacion/delete-reporte-nuevo-db"

export const deleteReporteNuevoServer = createServerFn({ method: "POST" })
	.inputValidator(reporteIluminacionIdValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await deleteReporteNuevoDB(data.id, session.user.id)

		if (!result) {
			throw new Error("Reporte not found or could not be deleted")
		}

		return result
	})
