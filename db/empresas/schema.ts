import { user } from "../users/schema"
import { pgTable, text, index, uuid, timestamp } from "drizzle-orm/pg-core"

export const empresas = pgTable(
	"expo_empresas",
	{
		id: text("id").primaryKey(),

		cuit: text("cuit").notNull(),

		razonSocial: text("razon_social").notNull(),

		direccion: text("direccion").notNull(),

		localidad: text("localidad").notNull(),

		provincia: text("provincia").notNull(),

		codigoPostal: text("codigo_postal").notNull(),

		horarios: text("horarios").notNull(),

		logo: text("logo").notNull(),

		deletedAt: timestamp("deleted_at"),

		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),

		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	table => [index("idx_expo_empresas_user").on(table.userId)]
)

export type EmpresaType = typeof empresas.$inferSelect
