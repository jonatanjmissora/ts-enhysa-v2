import {
	pgTable,
	text,
	integer,
	uuid,
	timestamp,
	index,
} from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const tecnicos = pgTable(
	"expo_tecnicos",
	{
		id: text("id").primaryKey(),

		nombre: text("nombre").notNull(),

		telefono: text("telefono").notNull(),

		localidad: text("localidad").notNull(),

		cargo: text("cargo").notNull(),

		matricula: text("matricula").notNull(),

		matriculaImg: text("matricula_img").notNull(),

		firmaImg: text("firma_img").notNull(),

		empresaLogo: text("empresa_logo").notNull(),

		dni: integer("dni"),

		deletedAt: timestamp("deleted_at"),

		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),

		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	table => [index("idx_expo_tecnicos_user").on(table.userId)]
)

export type TecnicoType = typeof tecnicos.$inferSelect
