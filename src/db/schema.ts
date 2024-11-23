import type { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  joinedAt: timestamp("joinedAt", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
export type UserType = InferSelectModel<typeof usersTable>;

export const roomsTable = pgTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  createdAt: timestamp("createdAt", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
export type RoomType = InferSelectModel<typeof roomsTable>;

export const roomUsersTable = pgTable("roomUsers", {
  roomId: text("roomId")
    .notNull()
    .references(() => roomsTable.id),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.id),
  joinedAt: timestamp("joinedAt", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
export type RoomUserType = InferSelectModel<typeof roomUsersTable>;
