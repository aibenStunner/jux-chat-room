import { authedProcedure, publicProcedure } from "@/server/trpc";
import RoomService from "./Service";
import { TRPCRouterRecord } from "@trpc/server";

import { z } from "zod";

const roomService = new RoomService();

export const roomRouter = {
  list: publicProcedure.query(() => {
    return roomService.get();
  }),
  create: authedProcedure
    .input(
      z.object({ roomName: z.string().trim().min(2), userName: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const roomId = await roomService.addChatRoom(
        input.roomName,
        input.userName
      );

      return roomId;
    }),
} satisfies TRPCRouterRecord;
