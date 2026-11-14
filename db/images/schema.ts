import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const expoImages = pgTable(
	"expo_images",
	{
		id: text("id").primaryKey(),

		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		filename: text("filename"),

		mimeType: text("mime_type"),

		width: integer("width"),

		height: integer("height"),

		size: integer("size"),

		remoteKey: text("remote_key"),

		remoteUrl: text("remote_url"),

		deletedAt: timestamp("deleted_at"),

		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index("idx_expo_images_user").on(table.userId)]
)

export type ExpoImageType = typeof expoImages.$inferSelect
