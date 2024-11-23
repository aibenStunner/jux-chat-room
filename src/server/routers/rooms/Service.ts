import { db } from "@/db/client";
import { eq, sql } from "drizzle-orm";
import { roomsTable, roomUsersTable } from "@/db/schema";

class RoomService {
  async get() {
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

  async addChatRoom(name: string) {
    const [room] = await db
      .insert(roomsTable)
      .values({
        name,
      })
      .returning();

    return room.id;
  }
}

export default RoomService;
