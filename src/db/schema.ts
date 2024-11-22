import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  joinedAt: timestamp("joinedAt", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }),
});
