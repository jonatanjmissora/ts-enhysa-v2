import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "@/lib/constants"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "../../../users/schema"
import { reportes_iluminacion } from "../schema"

export const localizadas_iluminacion = pgTable("localizadas_iluminacion", {
	id: text("id").primaryKey(),

	reportId: text("report_id")
		.notNull()
		.references(() => reportes_iluminacion.id, { onDelete: "cascade" }),

	nombre: text("nombre").notNull(),

	tipo: text("tipo").notNull(),

	iluminacionTipo: text("iluminacion_tipo", {
		enum: ILUMINACION_TIPO,
	}).notNull(),

	iluminacionFuente: text("iluminacion_fuente", {
		enum: ILUMINACION_FUENTE,
	}).notNull(),

	iluminacion: text("iluminacion", {
		enum: ILUMINACION,
	}).notNull(),

	valorRequerido: text("valor_requerido", {
		enum: VALORES_REQUERIDOS,
	}).notNull(),

	observaciones: text("observaciones").notNull(),

	imagenes: text("imagenes").array().notNull(),

	valor: integer("valor").notNull(),

	timestamps: timestamp("timestamps").array().notNull(),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})

export type LocalizadaIluminacionType =
	typeof localizadas_iluminacion.$inferSelect
