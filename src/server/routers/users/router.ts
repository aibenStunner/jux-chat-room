import { z } from "zod";

import { publicProcedure } from "@/server/trpc";
import { TRPCRouterRecord } from "@trpc/server";

import UserService from "./Service";

const userService = new UserService();

export const userRouter = {
  signIn: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [user] = await userService.addUser(input.name);

      return user;
    }),
  hasJoinedRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        userName: z.string().optional().nullable(),
      })
    )
    .query(({ input }) => {
      return userService.hasJoinedRoom(input.roomId, input.userName);
    }),
} satisfies TRPCRouterRecord;
