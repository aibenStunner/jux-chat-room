import { db } from "@/db/client";
import { eq, and, sql, asc, desc, lte, gt } from "drizzle-orm";
import { messageReactionsTable, messagesTable } from "@/db/schema";

class MessageService {
  async get(roomId: string, userName?: string | null) {
    if (!userName?.length) return;

    const messagesWithReactions = await db
      .select({
        id: messagesTable.id,
        text: messagesTable.text,
        userName: messagesTable.userName,
        createdAt: messagesTable.createdAt,
        likes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'like' THEN 1 END)`,
        dislikes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'dislike' THEN 1 END)`,
        userLiked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'like' AND ${messageReactionsTable.userName} = ${userName})`,
        userDisliked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'dislike' AND ${messageReactionsTable.userName} = ${userName})`,
      })
      .from(messagesTable)
      .leftJoin(
        messageReactionsTable,
        eq(messagesTable.id, messageReactionsTable.messageId)
      )
      .where(eq(messagesTable.roomId, roomId))
      .groupBy(messagesTable.id)
      .orderBy(asc(messagesTable.createdAt));

    return messagesWithReactions;
  }

  async getById(messageId: string) {
    return db.query.messagesTable.findFirst({
      where: (fields, ops) => ops.eq(fields.id, messageId),
    });
  }

  async getNewMessagesSinceTargetDate(
    roomId: string,
    targetDate: Date | null,
    userName?: string | null
  ) {
    if (!userName?.length) return [];
    return db
      .select({
        id: messagesTable.id,
        roomId: messagesTable.roomId,
        text: messagesTable.text,
        userName: messagesTable.userName,
        createdAt: messagesTable.createdAt,
        likes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'like' THEN 1 END)`,
        dislikes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'dislike' THEN 1 END)`,
        userLiked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'like' AND ${messageReactionsTable.userName} = ${userName})`,
        userDisliked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'dislike' AND ${messageReactionsTable.userName} = ${userName})`,
      })
      .from(messagesTable)
      .leftJoin(
        messageReactionsTable,
        eq(messagesTable.id, messageReactionsTable.messageId)
      )
      .where(
        and(
          eq(messagesTable.roomId, roomId),
          targetDate ? gt(messagesTable.createdAt, targetDate) : undefined
        )
      )
      .groupBy(messagesTable.id)
      .orderBy(asc(messagesTable.createdAt));
  }

  async getInfinite(
    roomId: string,
    take: number,
    cursor?: Date | null,
    userName?: string | null
  ) {
    if (!userName?.length) return;
    return await db
      .select({
        id: messagesTable.id,
        text: messagesTable.text,
        userName: messagesTable.userName,
        createdAt: messagesTable.createdAt,
        likes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'like' THEN 1 END)`,
        dislikes: sql<number>`COUNT(CASE WHEN ${messageReactionsTable.reactionType} = 'dislike' THEN 1 END)`,
        userLiked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'like' AND ${messageReactionsTable.userName} = ${userName})`,
        userDisliked: sql<boolean>`BOOL_OR(${messageReactionsTable.reactionType} = 'dislike' AND ${messageReactionsTable.userName} = ${userName})`,
      })
      .from(messagesTable)
      .leftJoin(
        messageReactionsTable,
        eq(messagesTable.id, messageReactionsTable.messageId)
      )
      .where(
        and(
          eq(messagesTable.roomId, roomId),
          cursor ? lte(messagesTable.createdAt, cursor) : undefined
        )
      )
      .groupBy(messagesTable.id)
      .orderBy(desc(messagesTable.createdAt))
      .limit(take + 1);
  }

  async insert(text: string, userName: string, roomId: string, id?: string) {
    const [post] = await db
      .insert(messagesTable)
      .values({
        id,
        text,
        userName,
        roomId,
      })
      .returning();

    return post;
  }

  async likeOrDislike(
    messageId: string,
    reactionType: "like" | "dislike",
    userName?: string | null
  ) {
    if (!userName?.length) return;
    const [reaction] = await db
      .insert(messageReactionsTable)
      .values({
        messageId,
        userName,
        reactionType,
      })
      .onConflictDoNothing();

    return reaction;
  }

  async undoLikeOrDislike(
    messageId: string,
    reactionType: "like" | "dislike",
    userName?: string | null
  ) {
    if (!userName?.length) return;
    const [reaction] = await db
      .select()
      .from(messageReactionsTable)
      .where(
        and(
          eq(messageReactionsTable.messageId, messageId),
          eq(messageReactionsTable.userName, userName),
          eq(messageReactionsTable.reactionType, reactionType)
        )
      )
      .limit(1);
    if (!reaction) throw new Error("Reaction not found");

    await db
      .delete(messageReactionsTable)
      .where(
        and(
          eq(messageReactionsTable.messageId, messageId),
          eq(messageReactionsTable.userName, userName),
          eq(messageReactionsTable.reactionType, reactionType)
        )
      );

    return true;
  }
}

export default MessageService;
