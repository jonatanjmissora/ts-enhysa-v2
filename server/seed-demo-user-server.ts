import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { user, account } from "../db/users/schema"
import { eq } from "drizzle-orm"
import { randomBytes, scrypt } from "node:crypto"

const DEMO_EMAIL = "demouser@enhysa.demo"
const DEMO_PASSWORD = "demodemo"

export const ensureDemoUser = createServerFn({ method: "GET" }).handler(async () => {
	const existing = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, DEMO_EMAIL))
		.limit(1)

	if (existing.length > 0) {
		return { email: DEMO_EMAIL, password: DEMO_PASSWORD }
	}

	const userId = crypto.randomUUID()
	const salt = randomBytes(16).toString("hex")
	const key = await new Promise<Buffer>((resolve, reject) =>
		scrypt(DEMO_PASSWORD.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1 }, (err, key) =>
			err ? reject(err) : resolve(key)
		)
	)
	const hashedPassword = `${salt}:${key.toString("hex")}`

	await db.insert(user).values({
		id: userId,
		name: "Demo User",
		email: DEMO_EMAIL,
		emailVerified: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	})

	await db.insert(account).values({
		id: crypto.randomUUID(),
		userId,
		accountId: userId,
		providerId: "credential",
		password: hashedPassword,
		createdAt: new Date(),
		updatedAt: new Date(),
	})

	return { email: DEMO_EMAIL, password: DEMO_PASSWORD }
})
