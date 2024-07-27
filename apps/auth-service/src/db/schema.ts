import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid),
  username: text("name").notNull(),
  password: text("password").notNull(),
});

export const refreshTokens = sqliteTable("refresh_token", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
  name: text("name").notNull(),
  userAgent: text("user_agent").notNull(),
});
