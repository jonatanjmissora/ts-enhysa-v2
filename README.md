Vamos a crear una aplicacion con el siguiente stack:
- Pnpm package manager
- Vite build tool 
- Tanstack Start framework
- TypeScript
- Tailwind CSS
- Neon
- Drizzle
- Tanstack Form
- Tanstack Query
- Shadcn
- Better-auth
- Zod
- Lucide Icons
- Netlify deploy platform
- Biome linter and formatter

* 1 - Con el siguiente comando crear el proyecto y añadimos dependencias.

    		pnpm create @tanstack/start@latest 

		pnpm dlx @tanstack/cli create . --add-ons netlify,drizzle,form,shadcn,better-auth,tanstack-query,biome,neon --yes

* 1.1 - Colocamos nuestro archivo de biome.jsonl en la raiz del proyecto.

* 2 - creamos un archivo .env en la raiz del proyecto con el siguiente contenido:

		BETTER_AUTH_SECRET=
		BETTER_AUTH_URL=http://localhost:3000 
		VITE_BETTER_AUTH_BASE_URL=http://localhost:3000 
		BETTER_AUTH_BASE_URL=http://localhost:3000 
		DATABASE_URL=
		GOOGLE_CLIENT_ID=
		GOOGLE_CLIENT_SECRET=

BACKEND
=======
* 3 - creamos los archivos de configuracion de neon y drizzle en la raiz del proyecto, en la carpeta /db
	en db/index.ts
	----------------

		import { drizzle } from "drizzle-orm/node-postgres"
		import * as schema from "./schema.ts"

		export const db = drizzle(process.env.DATABASE_URL as string, {
			schema,
		})

	en db/schema.ts
	------------------

		// Users / Better Auth
		export * from "./users/schema"

	en db/users/schema.ts
	-------------------------

		import { relations } from "drizzle-orm"
		import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core"

		export const user = pgTable("user", {
			id: text("id").primaryKey(),
			name: text("name").notNull(),
			email: text("email").notNull().unique(),
			emailVerified: boolean("email_verified").default(false).notNull(),
			image: text("image"),
			createdAt: timestamp("created_at").defaultNow().notNull(),
			updatedAt: timestamp("updated_at")
				.defaultNow()
				.$onUpdate(() => /* @__PURE__ */ new Date())
				.notNull(),
		})

		export const session = pgTable(
			"session",
			{
				id: text("id").primaryKey(),
				expiresAt: timestamp("expires_at").notNull(),
				token: text("token").notNull().unique(),
				createdAt: timestamp("created_at").defaultNow().notNull(),
				updatedAt: timestamp("updated_at")
					.$onUpdate(() => /* @__PURE__ */ new Date())
					.notNull(),
				ipAddress: text("ip_address"),
				userAgent: text("user_agent"),
				userId: text("user_id")
					.notNull()
					.references(() => user.id, { onDelete: "cascade" }),
			},
			table => [index("session_userId_idx").on(table.userId)]
		)

		export const account = pgTable(
			"account",
			{
				id: text("id").primaryKey(),
				accountId: text("account_id").notNull(),
				providerId: text("provider_id").notNull(),
				userId: text("user_id")
					.notNull()
					.references(() => user.id, { onDelete: "cascade" }),
				accessToken: text("access_token"),
				refreshToken: text("refresh_token"),
				idToken: text("id_token"),
				accessTokenExpiresAt: timestamp("access_token_expires_at"),
				refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
				scope: text("scope"),
				password: text("password"),
				createdAt: timestamp("created_at").defaultNow().notNull(),
				updatedAt: timestamp("updated_at")
					.$onUpdate(() => /* @__PURE__ */ new Date())
					.notNull(),
			},
			table => [index("account_userId_idx").on(table.userId)]
		)

		export const verification = pgTable(
			"verification",
			{
				id: text("id").primaryKey(),
				identifier: text("identifier").notNull(),
				value: text("value").notNull(),
				expiresAt: timestamp("expires_at").notNull(),
				createdAt: timestamp("created_at").defaultNow().notNull(),
				updatedAt: timestamp("updated_at")
					.defaultNow()
					.$onUpdate(() => /* @__PURE__ */ new Date())
					.notNull(),
			},
			table => [index("verification_identifier_idx").on(table.identifier)]
		)

		export const userRelations = relations(user, ({ many }) => ({
			sessions: many(session),
			accounts: many(account),
		}))

		export const sessionRelations = relations(session, ({ one }) => ({
			user: one(user, {
				fields: [session.userId],
				references: [user.id],
			}),
		}))

		export const accountRelations = relations(account, ({ one }) => ({
			user: one(user, {
				fields: [account.userId],
				references: [user.id],
			}),
		}))


* 4 - creamos/modificamos los archivos: vite.config.ts drizzle.config.ts y neon-vite-plugins.ts
	vite.config.ts:
	---------------

		import { defineConfig } from 'vite'
		import { devtools } from '@tanstack/devtools-vite'

		import { tanstackStart } from '@tanstack/react-start/plugin/vite'

		import viteReact from '@vitejs/plugin-react'
		import tailwindcss from '@tailwindcss/vite'
		import netlify from '@netlify/vite-plugin-tanstack-start'
		import neon from './neon-vite-plugin.ts'

		const config = defineConfig({
			resolve: { tsconfigPaths: true },
			plugins: [
			devtools(),
			netlify(),
			tailwindcss(),
			tanstackStart(),
			viteReact(),
			],
		})

    export default config
		
	drizzle.config.ts:
	-------------------
	
		import { config } from "dotenv"
		import { defineConfig } from "drizzle-kit"

		config({ path: [".env.local", ".env"] })

		const databaseUrl = process.env.DATABASE_URL
		if (!databaseUrl) throw new Error("DATABASE_URL is not set")

		export default defineConfig({
			out: "./drizzle",
			schema: "./db/schema.ts",
			dialect: "postgresql",
			dbCredentials: {
				url: databaseUrl,
			},
		})

	neon-vite-plugins.ts:
	---------------------
	
		import { postgres } from 'vite-plugin-db'

		export default postgres({
			seed: {
				type: 'sql-script',
				path: 'db/init.sql',
			},
			referrer: 'create-tanstack',
			dotEnvKey: 'VITE_DATABASE_URL',
		})

* 5 - borramos src/db y src/db.ts para que tome a db/schema.ts

* 6 - de neon, obtenemos las variables de entorno y hacemos el push

		npx drizzle-kit push
	
	
* 7 - hacemos el primer commit

NETLIFY
=======
* 8 - hacemos el deploy a netlify. Vamos a Netlify, nuevo proyecto, seleccionamos el repositorio de Github, dejamos todo por defecto, y colocamos las variables de entorno.

* 9 - copiamos imagenes a /public y modificamos el titulo en /src/routes/__root.tsx 

FRONTEND
========

* 10 - creamos los archivos auth.ts y auth-client donde me muestra mensajes si estoy bien conectado a better-auth y neon
	auth.ts:
	--------------
		
		import { betterAuth } from "better-auth"
		import { tanstackStartCookies } from "better-auth/tanstack-start"
		import { drizzleAdapter } from "better-auth/adapters/drizzle"
		import { drizzle } from "drizzle-orm/node-postgres"
		import pg from "pg"
		import * as schema from "../../db/schema"

		// Get base URL from environment variables
		const baseURL = process.env.BETTER_AUTH_BASE_URL

		// Database configuration
		const databaseUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL

		interface AuthOptions {
			baseURL?: string
			emailAndPassword: {
				enabled: boolean
			}
			plugins: any[]
			database?: any
			socialProviders?: {
				google: {
					clientId: string
					clientSecret: string
				}
			}
		}

		const authOptions: AuthOptions = {
			baseURL,
			socialProviders: {
				google: {
					clientId: process.env.GOOGLE_CLIENT_ID as string,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				},
			},
			emailAndPassword: {
				enabled: true,
			},
			plugins: [tanstackStartCookies()],
		}

		// Only add database configuration if DATABASE_URL is available
		if (databaseUrl) {
			try {
				const pool = new pg.Pool({
					connectionString: databaseUrl,
					ssl: databaseUrl.includes("sslmode=require") || databaseUrl.includes("sslmode=verify-full") ? { rejectUnauthorized: false } : false,
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

	auth-client.ts:
	-----------------
	
		import { createAuthClient } from "better-auth/react"

		// Check if Better Auth base URL is configured
		const checkBetterAuthConfig = () => {
			const baseURL = import.meta.env.VITE_BETTER_AUTH_BASE_URL

			if (!baseURL) {
				const warningMessage =
					"⚠️ Better Auth: Base URL no configurada. Por favor, configura VITE_BETTER_AUTH_BASE_URL en tu archivo .env para que los callbacks y redirecciones funcionen correctamente."

				// Also log to console for developers
				console.warn(warningMessage)
				console.info("Ejemplo: VITE_BETTER_AUTH_BASE_URL=http://localhost:3000")

				return false
			}

			return true
		}

		export const authClient = createAuthClient({
			baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
		})

		// Check configuration on module load
checkBetterAuthConfig()

* 9.1 - eliminamos el archivo .env.local sino no va a funcionar

* 10 - en __root.tsx agregamos los notFoundComponent y el errorComponent
	src/components/DefaultCatchBoundary.tsx
	---------------------------------------

		import { ErrorComponent,Link, rootRouteId,useMatch,useRouter,} from "@tanstack/react-router"
		import type { ErrorComponentProps } from "@tanstack/react-router"

		export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
			const router = useRouter()
			const isRoot = useMatch({
				strict: false,
				select: state => state.id === rootRouteId,
			})

			console.error("DefaultCatchBoundary Error:", error)

			return (
				<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
					<ErrorComponent error={error} />
					<div className="flex gap-2 items-center flex-wrap">
						<button
							onClick={() => {
								router.invalidate()
							}}
							className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold my-shadow`}
						>
							Try Again
						</button>
						{isRoot ? (
							<Link
								to="/"
								className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold my-shadow`}
							>
								Home
							</Link>
						) : (
							<Link
								to="/"
								className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
								onClick={e => {
									e.preventDefault()
									if (typeof window !== "undefined") {
										window.history.back()
									}
								}}
							>
								Go Back
							</Link>
						)}
					</div>
				</div>
			)
		}

* 11 - instalamos login03 de shadcn
                
		npx shadcn@latest add login-03

* 12 - google client
dentro de https://console.cloud.google.com/apis/dashboard?project=ts-better-auth-neon
viendo el video https://www.youtube.com/watch?v=xqd51D3O53k&list=LL&index=8        minuto 35
incluimos las rutas, tanto de desarrollo, como la de netlify

* 13 - agregamos el entorno .env, las claves de GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET y a las variables de netlify

* 14 - creamos los login-form.ts y register-form.ts en donde consumimos el auth-client.ts

* 15 - creamos src/routes/login/index.ts

		import { LoginForm } from "@/components/login-form"
		import { RegisterForm } from "@/components/register-form"
		import { createFileRoute } from "@tanstack/react-router"
		import { useState } from "react"

		export const Route = createFileRoute("/login/")({
			component: RouteComponent,
		})

		function RouteComponent() {
			const [activeForm, setActiveForm] = useState<"login" | "register">("login")
			const authPosition =
				activeForm === "login" ? "translate-x-[0px]" : "-translate-x-[100dvw]"

			return (
				<section className="w-screen h-screen overflow-hidden">
					<section
						className={`${authPosition} w-[200dvw] min-h-screen flex items-center justify-between gap-10 relative transition-transform duration-500`}
					>
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-screen flex justify-center items-center px-6">
							<LoginForm setActiveForm={setActiveForm} />
						</div>
						<div className="absolute right-0 top-1/2 -translate-y-1/2 w-screen flex justify-center items-center px-6">
							<RegisterForm setActiveForm={setActiveForm} />
						</div>
					</section>
				</section>
			)
		}