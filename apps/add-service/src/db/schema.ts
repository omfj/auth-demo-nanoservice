import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const addHistory = sqliteTable("add_history", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid),
  a: integer("a").notNull(),
  b: integer("b").notNull(),
  result: integer("result").notNull(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
