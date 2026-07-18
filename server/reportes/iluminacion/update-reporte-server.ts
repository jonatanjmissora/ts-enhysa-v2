import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from "../../../db"
import { reportes_iluminacion } from "../../../db/reportes/iluminacion/schema"
import { eq } from "drizzle-orm"
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

		const existing = await db
			.select({ creditConsumed: reportes_iluminacion.creditConsumed, creditConsumedAt: reportes_iluminacion.creditConsumedAt })
			.from(reportes_iluminacion)
			.where(eq(reportes_iluminacion.id, data.id))
			.limit(1)

		return await updateReporteDB({
			...data,
			finishedAt: data.finishedAt || null,
			creditConsumed: existing[0]?.creditConsumed ?? false,
			creditConsumedAt: existing[0]?.creditConsumedAt ?? null,
		})
	})
