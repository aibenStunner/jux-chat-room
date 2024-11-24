import { authedProcedure, publicProcedure } from "@/server/trpc";
import RoomService from "./Service";
import { TRPCRouterRecord, tracked } from "@trpc/server";

import { z } from "zod";
import { ee, WhoIsTyping } from "@/server/services/events";

const roomService = new RoomService();
export const currentlyTyping: Record<string, WhoIsTyping> = Object.create(null);

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
      await roomService.joinRoom(input.roomId, input.userName);

      const whoToEmit = {
        action: "joined",
        userName: input.userName,
        roomId: input.roomId,
      };
      ee.emit("joinOrLeave", whoToEmit);
    }),
  leave: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
        userName: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await roomService.leaveRoom(input.roomId, input.userName);

      const whoToEmit = {
        action: "left",
        userName: input.userName,
        roomId: input.roomId,
      };
      ee.emit("joinOrLeave", whoToEmit);
    }),

  isTyping: authedProcedure
    .input(z.object({ roomId: z.string(), typing: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = ctx.user;
      const { roomId } = input;

      if (!currentlyTyping[roomId]) {
        currentlyTyping[roomId] = {};
      }

      if (!input.typing) {
        delete currentlyTyping[roomId][name];
      } else {
        currentlyTyping[roomId][name] = {
          lastTyped: new Date(),
        };
      }
      ee.emit("isTypingUpdate", roomId, currentlyTyping[roomId]);
    }),
  whoIsTyping: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .subscription(async function* ({ input, signal }) {
      const { roomId } = input;

      let lastIsTyping = "";

      /**
       * yield who is typing if it has changed
       * won't yield if it's the same as last time
       */
      function* maybeYield(who: WhoIsTyping) {
        const idx = Object.keys(who).sort().toString();
        if (idx === lastIsTyping) {
          return;
        }
        yield Object.keys(who);

        lastIsTyping = idx;
      }

      // emit who is currently typing
      yield* maybeYield(currentlyTyping[roomId] ?? {});

      for await (const [channelId, who] of ee.toIterable("isTypingUpdate", {
        signal: signal,
      })) {
        if (channelId === input.roomId) {
          yield* maybeYield(who);
        }
      }
    }),
  onJoinOrLeave: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .subscription(async function* (opts) {
      const iterable = ee.toIterable("joinOrLeave", {
        signal: opts.signal,
      });

      function* maybeYield(who: {
        userName: string | null | undefined;
        action: string;
        roomId: string;
      }) {
        if (!who) return;
        if (who.roomId !== opts.input.roomId) {
          return;
        }
        yield tracked(who.roomId!, who);
      }

      // yield any who from the event emitter
      for await (const [who] of iterable) {
        yield* maybeYield(who);
      }
    }),
} satisfies TRPCRouterRecord;
