import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "@/lib/constants"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "../../../users/schema"

export const areas_iluminacion = pgTable("areas_iluminacion", {
	id: text("id").primaryKey(),

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

	largo: integer("largo").notNull(),

	ancho: integer("ancho").notNull(),

	alto: integer("alto").notNull(),

	imagenes: text("imagenes").array().notNull(),

	puntos: integer("puntos").array().notNull(),

	timestamps: timestamp("timestamps").array().notNull(),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})

export type AreaIluminacionType = typeof areas_iluminacion.$inferSelect
