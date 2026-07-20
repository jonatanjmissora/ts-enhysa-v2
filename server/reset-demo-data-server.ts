import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { auth } from "../src/lib/auth"
import { db } from "../db"
import { user, session as sessionTable } from "../db/users/schema"
import { and, eq, gt, count } from "drizzle-orm"

const DEMO_EMAIL_DOMAIN = "@enhysa.demo"
const DEMO_EMAIL_PREFIX = "demo"

export const resetDemoData = createServerFn({ method: "POST" }).handler(async () => {
	const request = getRequest()
	const userSession = await auth.api.getSession({ headers: request.headers })

	if (!userSession) throw new Error("No autorizado")

	const email = userSession.user.email
	if (!email?.startsWith(DEMO_EMAIL_PREFIX) || !email?.endsWith(DEMO_EMAIL_DOMAIN))
		throw new Error("No es un usuario demo")

	const userId = userSession.user.id

	const result = await db
		.select({ count: count() })
		.from(sessionTable)
		.where(
			and(
				eq(sessionTable.userId, userId),
				gt(sessionTable.expiresAt, new Date())
			)
		)

	const activeSessions = Number(result[0]?.count ?? 0)

	if (activeSessions > 1) {
		return { success: true, skipped: true }
	}

	await db.delete(user).where(eq(user.id, userId))

	return { success: true, skipped: false }
})
