import { pgTable, text, integer } from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const tecnicos = pgTable("tecnicos", {
	id: text("id").primaryKey(),

	nombre: text("nombre").notNull(),

	telefono: text("telefono").notNull(),

	localidad: text("localidad").notNull(),

	cargo: text("cargo").notNull(),

	matricula: text("matricula").notNull(),

	matriculaImg: text("matriculaImg").notNull(),

	firmaImg: text("firmaImg").notNull(),

	empresaLogo: text("empresaLogo").notNull(),

	dni: integer("dni"),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})

export type TecnicoType = typeof tecnicos.$inferSelect
