import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "../../db"
import { expoImages } from "../../db/images/schema"
import { protectedServerFn } from "@/lib/protected-server-fn"

const createImageValidator = z.object({
	key: z.string().min(1),
	url: z.string().url(),
	name: z.string().optional(),
	mimeType: z.string().optional(),
	size: z.number().int().nonnegative().optional(),
	width: z.number().int().nonnegative().optional(),
	height: z.number().int().nonnegative().optional(),
})

export const createImageServer = createServerFn({ method: "POST" })
	.validator(createImageValidator)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const existing = await db
			.select({ id: expoImages.id, url: expoImages.remoteUrl })
			.from(expoImages)
			.where(
				and(
					eq(expoImages.userId, session.user.id),
					eq(expoImages.remoteKey, data.key),
					isNull(expoImages.deletedAt)
				)
			)
			.limit(1)

		if (existing[0]) {
			return {
				id: existing[0].id,
				url: existing[0].url ?? data.url,
			}
		}

		const id = crypto.randomUUID()

		const [row] = await db
			.insert(expoImages)
			.values({
				id,
				userId: session.user.id,
				filename: data.name ?? null,
				mimeType: data.mimeType ?? null,
				size: data.size ?? null,
				width: data.width ?? 0,
				height: data.height ?? 0,
				remoteKey: data.key,
				remoteUrl: data.url,
				deletedAt: null,
				updatedAt: new Date(),
			})
			.returning()

		return {
			id: row.id,
			url: row.remoteUrl ?? data.url,
		}
	})
