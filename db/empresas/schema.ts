import { user } from "../users/schema"
import { pgTable, text, index } from "drizzle-orm/pg-core"

export const empresas = pgTable(
	"empresas",
	{
		id: text("id").primaryKey(),

		cuit: text("cuit").notNull(),

		razonSocial: text("razonSocial").notNull(),

		direccion: text("direccion").notNull(),

		localidad: text("localidad").notNull(),

		provincia: text("provincia").notNull(),

		codigoPostal: text("codigoPostal").notNull(),

		horarios: text("horarios").notNull(),

		logo: text("logo").notNull(),

		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	table => ({
		userIdx: index("items_user_idx").on(table.userId, table.userId),
	})
)

export type EmpresaType = typeof empresas.$inferSelect
