import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { reporteServerValidator } from "../../../db/reportes/iluminacion/reporte-validator"
import { createReporteDB } from "../../../db/reportes/iluminacion/create-reporte-db"

export const createNuevoReporteServer = createServerFn({ method: "POST" })
	.inputValidator(reporteServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		const newReport = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			createdAt: new Date(),
			finishedAt: null,
			observacion: "",
			conclusion: "",
			recomendacion: "",
		}

		const result = await createReporteDB(newReport)
		if (!result) {
			throw new Error("Failed to create report")
		}
		return result[0]
	})

export const createReporteServer = createServerFn({ method: "POST" })
	.inputValidator(reporteServerValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)
		const newReport = {
			...data,
			id: crypto.randomUUID(),
			userId: session.user.id,
			createdAt: new Date(),
			finishedAt: new Date(),
			observacion: "",
			conclusion: "",
			recomendacion: "",
		}

		const result = await createReporteDB(newReport)
		if (!result) {
			throw new Error("Failed to create report")
		}
		return result[0]
	})
