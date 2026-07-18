import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { reporteServerValidator } from "../../../db/reportes/iluminacion/reporte-validator"
import { createReporteNuevoDB } from "../../../db/reportes/iluminacion/create-reporte-nuevo-db"

export const createReporteNuevoServer = createServerFn({ method: "POST" })
	.validator(reporteServerValidator)
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
			creditConsumed: false,
			creditConsumedAt: null,
		}

		const result = await createReporteNuevoDB(newReport)
		if (!result) {
			throw new Error("Failed to create report")
		}
		return result[0]
	})

// export const createReporteServer = createServerFn({ method: "POST" })
// 	.validator(reporteServerValidator)
// 	.handler(async ({ data }) => {
// 		const request = getRequest()
// 		const session = await protectedServerFn(request)
// 		const newReport = {
// 			...data,
// 			id: crypto.randomUUID(),
// 			userId: session.user.id,
// 			createdAt: new Date(),
// 			finishedAt: new Date(),
// 			observacion: "",
// 			conclusion: "",
// 			recomendacion: "",
// 		}

// 		const result = await createReporteDB(newReport)
// 		if (!result) {
// 			throw new Error("Failed to create report")
// 		}
// 		return result[0]
// 	})
