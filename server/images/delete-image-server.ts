import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "../../db"
import { expoImages } from "../../db/images/schema"
import { protectedServerFn } from "@/lib/protected-server-fn"

export const deleteImageServer = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const rows = await db
			.update(expoImages)
			.set({ deletedAt: new Date(), updatedAt: new Date() })
			.where(
				and(
					eq(expoImages.id, data.id),
					eq(expoImages.userId, session.user.id),
					isNull(expoImages.deletedAt)
				)
			)
			.returning({ id: expoImages.id })

		return { success: rows.length > 0 }
	})
