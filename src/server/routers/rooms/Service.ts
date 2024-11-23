import { db } from "@/db/client";
import { eq, and, sql } from "drizzle-orm";
import { roomsTable, roomUsersTable } from "@/db/schema";
import UserService from "../users/Service";

class RoomService {
  async getAll() {
    return await db
      .select({
        id: roomsTable.id,
        name: roomsTable.name,
        userCount: sql<number>`COUNT(${roomUsersTable.userId})`,
        createdAt: roomsTable.createdAt,
      })
      .from(roomsTable)
      .leftJoin(roomUsersTable, eq(roomsTable.id, roomUsersTable.roomId))
      .groupBy(roomsTable.id);
  }

  async getRoom(roomId: string) {
    const [room] = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.id, roomId));
    return room;
  }

  async addChatRoom(name: string, userName: string) {
    const [room] = await db
      .insert(roomsTable)
      .values({
        name,
      })
      .returning();
    const user = await new UserService().getUser(userName);

    if (user) {
      await db.insert(roomUsersTable).values({
        userId: user.id,
        roomId: room.id,
      });
    }

    return room.id;
  }

  async joinRoom(roomId: string, userName?: string | null) {
    if (!userName?.length) return;

    const user = await new UserService().getUser(userName);
    if (!user) throw new Error("User not found");

    await db
      .insert(roomUsersTable)
      .values({
        userId: user.id,
        roomId: roomId,
      })
      .onConflictDoNothing();

    return true;
  }

  async leaveRoom(roomId: string, userName?: string | null) {
    if (!userName?.length) return;

    const user = await new UserService().getUser(userName);
    if (!user) throw new Error("User not found");

    await db
      .delete(roomUsersTable)
      .where(
        and(
          eq(roomUsersTable.roomId, roomId),
          eq(roomUsersTable.userId, user.id)
        )
      );

    return true;
  }
}

export default RoomService;
