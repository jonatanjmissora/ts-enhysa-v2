import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { reporteFormValidator } from "../../../db/reportes/iluminacion/reporte-validator"
import { createReporteDB } from "../../../db/reportes/iluminacion/create-reporte-db"

export const createReporteServer = createServerFn({ method: "POST" })
	.inputValidator(reporteFormValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		const newReport = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			createdAt: new Date(),
			finishedAt: null,
		}

		const result = await createReporteDB(newReport)
		if (!result) {
			throw new Error("Failed to create report")
		}
		return result[0]
	})
