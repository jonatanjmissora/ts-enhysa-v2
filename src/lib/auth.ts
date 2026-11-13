import { betterAuth } from "better-auth"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { bearer } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "../../db/schema"
import { verifyPasswordCompat } from "./password-compat"

// Get base URL from environment variables
const baseURL = process.env.BETTER_AUTH_BASE_URL

// Database configuration
const databaseUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL

interface AuthOptions {
	baseURL?: string
	emailAndPassword: {
		enabled: boolean
		password?: {
			verify: (data: { hash: string; password: string }) => Promise<boolean>
		}
	}
	advanced?: {
		database?: {
			generateId?: "uuid"
		}
	}
	plugins: any[]
	database?: any
}

const authOptions: AuthOptions = {
	baseURL,
	emailAndPassword: {
		enabled: true,
		password: {
			verify: verifyPasswordCompat,
		},
	},
	advanced: {
		database: {
			generateId: "uuid",
		},
	},
	plugins: [tanstackStartCookies(), bearer()],
}

// Only add database configuration if DATABASE_URL is available
if (databaseUrl) {
	try {
		const pool = new pg.Pool({
			connectionString: databaseUrl,
			ssl:
				databaseUrl.includes("sslmode=require") ||
				databaseUrl.includes("sslmode=verify-full")
					? { rejectUnauthorized: false }
					: false,
		})
		const db = drizzle(pool, { schema })

		authOptions.database = drizzleAdapter(db, {
			provider: "pg",
			schema: {
				user: schema.user,
				account: schema.account,
				session: schema.session,
				verification: schema.verification,
			},
		})

		console.log("✅ Better Auth: Base de datos configurada correctamente")
	} catch (error) {
		console.error("❌ Better Auth: Error configurando la base de datos:", error)
		console.warn("⚠️ Better Auth: Funcionará sin persistencia de datos")
	}
} else {
	console.warn(
		"⚠️ Better Auth: DATABASE_URL no configurada. Funcionará sin persistencia de datos."
	)
	console.info(
		"💡 Para habilitar la persistencia, configura DATABASE_URL en tu archivo .env"
	)
}

export const auth = betterAuth(authOptions)
