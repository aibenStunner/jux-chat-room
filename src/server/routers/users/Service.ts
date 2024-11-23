import { db } from "@/db/client";
import { eq, and } from "drizzle-orm";
import { roomUsersTable, usersTable } from "@/db/schema";

class UserService {
  async addUser(name: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.name, name))
      .limit(1);
    if (user.length) return user;

    return await db
      .insert(usersTable)
      .values({ name })
      .onConflictDoNothing()
      .returning();
  }

  async getUser(name: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.name, name))
      .limit(1);
    return user;
  }

  async hasJoinedRoom(roomId: string, name?: string | null) {
    if (!name?.length || !roomId.length) return false;

    const [userRoom] = await db
      .select({ roomId: roomUsersTable.roomId, userId: roomUsersTable.userId })
      .from(usersTable)
      .leftJoin(roomUsersTable, eq(usersTable.id, roomUsersTable.userId))
      .where(and(eq(usersTable.name, name), eq(roomUsersTable.roomId, roomId)));

    return !!userRoom;
  }
}

export default UserService;
