import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { user } from "../../users/schema"
import { tecnicos } from "../../tecnicos/schema"
import { empresas } from "../../empresas/schema"
import { instrumentos } from "../../instrumentos/schema"
import type { ClimaType } from "#/lib/constants"
import { relations } from "drizzle-orm"

export const reportes_iluminacion = pgTable("reportes_iluminacion", {
	id: text("id").primaryKey(),

	title: text("title").notNull(),

	tecnicoId: text("tecnico_id")
		.notNull()
		.references(() => tecnicos.id, { onDelete: "cascade" }),

	empresaId: text("empresa_id")
		.notNull()
		.references(() => empresas.id, { onDelete: "cascade" }),

	instrumentoId: text("instrumento_id")
		.notNull()
		.references(() => instrumentos.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull(),

	clima: text("clima").array().notNull().$type<ClimaType>(),

	observacion: text("observacion").default("").notNull(),

	conclusion: text("conclusion").default("").notNull(),

	recomendacion: text("recomendacion").default("").notNull(),

	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	finishedAt: timestamp("finished_at"),

	creditConsumed: boolean("credit_consumed").default(false).notNull(),
	creditConsumedAt: timestamp("credit_consumed_at"),
})

export type ReporteIluminacionType = typeof reportes_iluminacion.$inferSelect

export const reportesRelations = relations(reportes_iluminacion, ({ one }) => ({
	empresa: one(empresas, {
		fields: [reportes_iluminacion.empresaId],
		references: [empresas.id],
	}),

	instrumento: one(instrumentos, {
		fields: [reportes_iluminacion.instrumentoId],
		references: [instrumentos.id],
	}),

	tecnico: one(tecnicos, {
		fields: [reportes_iluminacion.tecnicoId],
		references: [tecnicos.id],
	}),
}))
