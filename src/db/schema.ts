import type { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  uniqueIndex,
  customType,
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

export const roomUsersTable = pgTable(
  "roomUsers",
  {
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
  },
  (t) => ({
    roomIdUserIdUniqueIndex: uniqueIndex().on(t.roomId, t.userId),
  })
);
export type RoomUserType = InferSelectModel<typeof roomUsersTable>;

export const messagesTable = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roomId: text("roomId")
    .notNull()
    .references(() => roomsTable.id),

  userName: text("userName")
    .notNull()
    .references(() => usersTable.name),
  text: text("text").notNull(),

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
export type MessageType = InferSelectModel<typeof messagesTable>;

const customColumnReactionType = customType<{ data: "like" | "dislike" }>({
  dataType() {
    return "text";
  },
});
export const messageReactionsTable = pgTable(
  "messageReactions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    messageId: text("messageId")
      .notNull()
      .references(() => messagesTable.id),
    userName: text("userName")
      .notNull()
      .references(() => usersTable.name),
    reactionType: customColumnReactionType("reactionType").notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }),
  },
  (t) => ({
    messageIdUserIdReactionTypeUniqueIndex: uniqueIndex().on(
      t.messageId,
      t.userName,
      t.reactionType
    ),
  })
);
export type MessageReactionType = InferSelectModel<
  typeof messageReactionsTable
>;
