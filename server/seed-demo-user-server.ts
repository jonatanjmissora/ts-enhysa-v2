import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { user, account } from "../db/users/schema"
import { and, lt, like, count, eq } from "drizzle-orm"
import { randomBytes, randomInt, scrypt } from "node:crypto"

const DEMO_DOMAIN = "@enhysa.demo"
const DEMO_PREFIX = "demo"
const MAX_DEMO_USERS = 5
const TTL_MS = 24 * 60 * 60 * 1000

export const ensureDemoUser = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const cutoff = new Date(Date.now() - TTL_MS)

			const oldUsers = await db
				.select({ id: user.id })
				.from(user)
				.where(
					and(
						like(user.email, `${DEMO_PREFIX}%${DEMO_DOMAIN}`),
						lt(user.createdAt, cutoff)
					)
				)

			for (const old of oldUsers) {
				await db.delete(user).where(eq(user.id, old.id))
			}

			const allDemoUsers = await db.select().from(user)

			const activeDemoUsers = allDemoUsers.filter(u =>
				u.email.startsWith(DEMO_PREFIX) && u.email.endsWith(DEMO_DOMAIN)
			)

			const activeCount = activeDemoUsers.length

			if (activeCount >= MAX_DEMO_USERS) {
				throw new Error("Demasiadas sesiones demo activas. Intente más tarde.")
			}

			const usedNumbers = activeDemoUsers
				.map(u => {
					const match = u.email.match(/^demo(\d+)@enhysa\.demo$/)
					return match ? Number(match[1]) : null
				})
				.filter((n): n is number => n !== null)

			let nextNumber = 1
			while (usedNumbers.includes(nextNumber)) {
				nextNumber++
			}

			const email = `${DEMO_PREFIX}${nextNumber}${DEMO_DOMAIN}`
			const password = String(randomInt(0, 10000)).padStart(4, "0")
			const userId = crypto.randomUUID()

			const salt = randomBytes(16).toString("hex")
			const N = 16384,
				r = 16
			const key = await new Promise<Buffer>((resolve, reject) =>
				scrypt(
					password.normalize("NFKC"),
					salt,
					64,
					{ N, r, p: 1, maxmem: 128 * N * r * 2 },
					(err, key) => (err ? reject(err) : resolve(key))
				)
			)
			const hashedPassword = `${salt}:${key.toString("hex")}`

			await db.insert(user).values({
				id: userId,
				name: "Demo User",
				email,
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

			return { email, password }
		} catch (err) {
			console.error("[DEMO ERROR]", err)
			throw err
		}
	}
)
