import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from "../../db"
import { userCredits } from "../../db/credits/schema"
import { eq } from "drizzle-orm"

export const getUserCreditsServer = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const result = await db
			.select({ credits: userCredits.credits })
			.from(userCredits)
			.where(eq(userCredits.userId, session.user.id))
			.limit(1)

		return result[0]?.credits ?? 0
	},
)
