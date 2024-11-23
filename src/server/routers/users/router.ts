import { z } from "zod";

import { publicProcedure } from "@/server/trpc";
import { TRPCRouterRecord } from "@trpc/server";

import UserService from "./Service";

const userService = new UserService();

export const userRouter = {
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
