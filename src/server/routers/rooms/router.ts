import { publicProcedure } from "@/server/trpc";
import RoomService from "./Service";
import { TRPCRouterRecord } from "@trpc/server";

const roomService = new RoomService();

export const roomRouter = {
  list: publicProcedure.query(() => {
    return roomService.get();
  }),
} satisfies TRPCRouterRecord;
