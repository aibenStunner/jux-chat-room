import { authedProcedure, publicProcedure } from "@/server/trpc";
import RoomService from "./Service";
import { TRPCRouterRecord } from "@trpc/server";

import { z } from "zod";

const roomService = new RoomService();

export const roomRouter = {
  get: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(({ input }) => {
      return roomService.getRoom(input.roomId);
    }),
  list: publicProcedure.query(() => {
    return roomService.getAll();
  }),
  create: authedProcedure
    .input(
      z.object({ roomName: z.string().trim().min(2), userName: z.string() })
    )
    .mutation(async ({ input }) => {
      const roomId = await roomService.addChatRoom(
        input.roomName,
        input.userName
      );

      return roomId;
    }),
  join: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
        userName: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      return await roomService.joinRoom(input.roomId, input.userName);
    }),
  leave: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
        userName: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      return await roomService.leaveRoom(input.roomId, input.userName);
    }),
} satisfies TRPCRouterRecord;
