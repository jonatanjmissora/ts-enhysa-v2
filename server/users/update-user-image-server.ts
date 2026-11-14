import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "../../db"
import { expoImages } from "../../db/images/schema"
import { user } from "../../db/users/schema"
import { protectedServerFn } from "@/lib/protected-server-fn"

export const updateUserImageServer = createServerFn({ method: "POST" })
	.validator(z.object({ imageId: z.string().nullable() }))
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		if (data.imageId) {
			const images = await db
				.select({ id: expoImages.id })
				.from(expoImages)
				.where(
					and(
						eq(expoImages.id, data.imageId),
						eq(expoImages.userId, session.user.id),
						isNull(expoImages.deletedAt)
					)
				)
				.limit(1)

			if (!images[0]) {
				throw new Error("La imagen no existe o no pertenece al usuario")
			}
		}

		const [updated] = await db
			.update(user)
			.set({ image: data.imageId, updatedAt: new Date() })
			.where(eq(user.id, session.user.id))
			.returning({ image: user.image })

		return { image: updated?.image ?? null }
	})
