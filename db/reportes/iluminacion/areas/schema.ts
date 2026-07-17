import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "@/lib/constants"
import { integer, pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core"
import { user } from "../../../users/schema"
import { reportes_iluminacion } from "../schema"

export const areas_iluminacion = pgTable("areas_iluminacion", {
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
		enum: VALORES_REQUERIDOS as [string, ...string[]],
	}).notNull(),

	observaciones: text("observaciones").notNull(),

	largo: numeric("largo", { mode: "number" }).notNull(),

	ancho: numeric("ancho", { mode: "number" }).notNull(),

	alto: numeric("alto", { mode: "number" }).notNull(),

	imagenes: text("imagenes").array().notNull(),

	puntos: integer("puntos").array().notNull(),

	timestamps: timestamp("timestamps").array().notNull(),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})

export type AreaIluminacionType = typeof areas_iluminacion.$inferSelect
