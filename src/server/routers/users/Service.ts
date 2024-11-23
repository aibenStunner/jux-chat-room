import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

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
}

export default UserService;
