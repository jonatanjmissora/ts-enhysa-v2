import { pgTable, text } from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const instrumentos = pgTable("instrumentos", {
	id: text("id").primaryKey(),

	nombre: text("nombre").notNull(),

	marca: text("marca").notNull(),

	modelo: text("modelo").notNull(),

	serie: text("serie").notNull(),

	fechaCalibracion: text("fechaCalibracion").notNull(),

	imagenes: text("imagenes").array().notNull(),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})

export type InstrumentoType = typeof instrumentos.$inferSelect
