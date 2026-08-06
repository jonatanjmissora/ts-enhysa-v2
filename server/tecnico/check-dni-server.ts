import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from "../../db"
import { tecnicos } from "../../db/tecnicos/schema"
import { eq, and, ne, isNotNull } from "drizzle-orm"

export const checkDniServer = createServerFn({ method: "POST" })
	.validator((d: { dni: string; excludeId?: string }) => d)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const dniNum = Number(data.dni)
		if (Number.isNaN(dniNum)) return { exists: false }

		const existing = await db
			.select({ id: tecnicos.id })
			.from(tecnicos)
			.where(
				data.excludeId
					? and(
							eq(tecnicos.dni, dniNum),
							ne(tecnicos.id, data.excludeId),
							isNotNull(tecnicos.dni)
						)
					: and(eq(tecnicos.dni, dniNum), isNotNull(tecnicos.dni))
			)

		return { exists: existing.length > 0, userId: session.user.id }
	})
