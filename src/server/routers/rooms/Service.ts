import { db } from "@/db/client";
import { eq, sql } from "drizzle-orm";
import { roomsTable, roomUsersTable } from "@/db/schema";
import UserService from "../users/Service";

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
}

export default RoomService;
