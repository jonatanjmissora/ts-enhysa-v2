import {
	pgTable,
	text,
	integer,
	timestamp,
	unique,
	numeric,
	uuid,
} from "drizzle-orm/pg-core"
import { user } from "../users/schema"
import { reportes_iluminacion } from "../reportes/iluminacion/schema"

export const userCredits = pgTable("expo_user_credits", {
	userId: uuid("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	credits: numeric("credits", { precision: 10, scale: 2, mode: "number" })
		.notNull()
		.default(0),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export type UserCreditsType = typeof userCredits.$inferSelect

export const creditHistory = pgTable(
	"credit_history",
	{
		id: text("id").primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type", {
			enum: ["purchase", "consume", "bonus", "refund"],
		}).notNull(),
		credits: integer("credits").notNull(),
		reportId: text("report_id").references(() => reportes_iluminacion.id, {
			onDelete: "set null",
		}),
		paymentId: text("payment_id"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	table => ({
		paymentTypeUnique: unique().on(table.paymentId, table.type),
	})
)

export type CreditHistoryType = typeof creditHistory.$inferSelect
