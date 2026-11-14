import {
	customType,
	index,
	json,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"
import { user } from "../users/schema"

const isoDate = customType<{ data: Date; driverData: string }>({
	dataType() {
		return "text"
	},
	fromDriver(value) {
		return new Date(value)
	},
	toDriver(value) {
		return value instanceof Date ? value.toISOString() : String(value)
	},
})

export const instrumentos = pgTable(
	"expo_instrumentos",
	{
		id: text("id").primaryKey(),

		nombre: text("nombre").notNull(),

		marca: text("marca").notNull(),

		modelo: text("modelo").notNull(),

		serie: text("serie").notNull(),

		fechaCalibracion: isoDate("fecha_calibracion").notNull(),

		imagenesCalibracion: json("imagenes_calibracion")
			.$type<string[]>()
			.notNull(),

		imagenes: json("imagenes").$type<string[]>().notNull(),

		deletedAt: timestamp("deleted_at"),

		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),

		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	table => [index("idx_expo_instrumentos_user").on(table.userId)]
)

export type InstrumentoType = typeof instrumentos.$inferSelect
