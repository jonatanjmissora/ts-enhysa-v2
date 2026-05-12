import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "../../users/schema"
import { tecnicos } from "../../tecnicos/schema"
import { empresas } from "../../empresas/schema"
import { instrumentos } from "../../instrumentos/schema"
import type { ClimaType } from "#/lib/constants"

export const reportes_iluminacion = pgTable("reportes_iluminacion", {
	id: text("id").primaryKey(),

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
})

export type ReporteIluminacionType = typeof reportes_iluminacion.$inferSelect
