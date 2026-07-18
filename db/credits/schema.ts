import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core"
import { user } from "../users/schema"
import { reportes_iluminacion } from "../reportes/iluminacion/schema"

export const userCredits = pgTable("user_credits", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	credits: integer("credits").notNull().default(0),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export type UserCreditsType = typeof userCredits.$inferSelect

export const creditHistory = pgTable("credit_history", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	type: text("type", { enum: ["purchase", "consume", "bonus", "refund"] }).notNull(),
	credits: integer("credits").notNull(),
	reportId: text("report_id").references(() => reportes_iluminacion.id, { onDelete: "set null" }),
	paymentId: text("payment_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type CreditHistoryType = typeof creditHistory.$inferSelect
