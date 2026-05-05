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

1 - Con el siguiente comando crear el proyecto y añadimos dependencias.

    pnpm create @tanstack/start@latest 

		pnpm dlx @tanstack/cli create . --add-ons netlify,drizzle,form,shadcn,better-auth,tanstack-query,biome,neon --yes

2 - creamos un archivo .env en la raiz del proyecto con el siguiente contenido:

		BETTER_AUTH_SECRET=
		BETTER_AUTH_URL=http://localhost:3000 
		VITE_BETTER_AUTH_BASE_URL=http://localhost:3000 
		BETTER_AUTH_BASE_URL=http://localhost:3000 
		DATABASE_URL=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

BACKEND
=======
3 - creamos los archivos de configuracion de neon y drizzle en la raiz del proyecto, en la carpeta /db
	en db/index.ts

		import { drizzle } from "drizzle-orm/node-postgres"
		import * as schema from "./schema.ts"

		export const db = drizzle(process.env.DATABASE_URL as string, {
			schema,
		})

	en db/schema.ts

		// Users / Better Auth
		export * from "./users/schema"

	en db/users/schema.ts

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

4 - de neon, obtenemos las variables de entorno y hacemos el push

		npx drizzle-kit push

5 - creamos/modificamos los archivos: vite.config.ts drizzle.config.ts y neon-vite-plugins.ts
	vite.config.ts:

		import { defineConfig } from "vite"
		import { devtools } from "@tanstack/devtools-vite"
		import { tanstackStart } from "@tanstack/react-start/plugin/vite"
		import viteReact from "@vitejs/plugin-react"
		import viteTsConfigPaths from "vite-tsconfig-paths"
		import netlify from "@netlify/vite-plugin-tanstack-start"

		import tailwindcss from "@tailwindcss/vite"

		export default defineConfig({
			base: "/",
			build: {
				outDir: "dist",
			},
			plugins: [
				devtools(),
				viteTsConfigPaths({
					projects: ["./tsconfig.json"],
				}),
				tailwindcss(),
				tanstackStart(),
				netlify(),
				viteReact(),
			],
		})
		
	drizzle.config.ts:
	
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
	
	
		import { postgres } from 'vite-plugin-db'

		export default postgres({
			seed: {
				type: 'sql-script',
				path: 'db/init.sql',
			},
			referrer: 'create-tanstack',
			dotEnvKey: 'VITE_DATABASE_URL',
		})
	
	
FRONTEND
========
6 - hacemos el primer commit

7 - hacemos el deploy a netlify

8 - creamos los archivos auth.ts y auth-client