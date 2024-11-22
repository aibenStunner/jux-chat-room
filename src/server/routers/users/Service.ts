import { db } from "@/db/client";
import { usersTable } from "@/db/schema";

class UserService {
  async addUser(name: string) {
    return await db.insert(usersTable).values({ name }).onConflictDoNothing();
  }
}

export default UserService;
