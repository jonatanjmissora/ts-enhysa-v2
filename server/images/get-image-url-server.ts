import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { and, eq, inArray, isNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "../../db"
import { expoImages } from "../../db/images/schema"
import { protectedServerFn } from "@/lib/protected-server-fn"

export const getImageUrlServer = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const rows = await db
			.select({ url: expoImages.remoteUrl })
			.from(expoImages)
			.where(
				and(
					eq(expoImages.id, data.id),
					eq(expoImages.userId, session.user.id),
					isNull(expoImages.deletedAt)
				)
			)
			.limit(1)

		return rows[0]?.url ?? null
	})

export const getImageUrlsServer = createServerFn({ method: "GET" })
	.validator(z.object({ ids: z.array(z.string().min(1)).max(200) }))
	.handler(async ({ data }) => {
		if (data.ids.length === 0) return {} as Record<string, string>

		const request = getRequest()
		const session = await protectedServerFn(request)

		const rows = await db
			.select({ id: expoImages.id, url: expoImages.remoteUrl })
			.from(expoImages)
			.where(
				and(
					inArray(expoImages.id, data.ids),
					eq(expoImages.userId, session.user.id),
					isNull(expoImages.deletedAt)
				)
			)

		return Object.fromEntries(
			rows
				.filter(row => row.url)
				.map(row => [row.id, row.url as string])
		) as Record<string, string>
	})
