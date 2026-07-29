import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const pendingPayments = pgTable("pending_payments", {
	preferenceId: text("preference_id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	planId: text("plan_id").notNull(),
	mpPaymentId: text("mp_payment_id"),
	status: text("status", { enum: ["pending", "approved", "rejected"] })
		.notNull()
		.default("pending"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export type PendingPaymentType = typeof pendingPayments.$inferSelect
