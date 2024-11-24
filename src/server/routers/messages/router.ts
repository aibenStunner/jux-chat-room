import { z } from "zod";
import { tracked } from "@trpc/server";
import { authedProcedure, router } from "@/server/trpc";
import MessageService from "./Service";
import { ee, FetchedMessage } from "@/server/services/events";

const messageService = new MessageService();

export const messageRouter = router({
  list: authedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        userName: z.string().optional().nullable(),
      })
    )
    .query(async ({ input }) => {
      return await messageService.get(input.roomId, input.userName);
    }),
  add: authedProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        roomId: z.string().uuid(),
        text: z.string().trim().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { roomId, id, text } = input;

      const message = await messageService.insert(
        text,
        ctx.user.name,
        roomId,
        id
      );

      const messageToEmit = {
        id: message.id,
        roomId,
        text: message.text,
        userName: ctx.user.name,
        likes: 0,
        dislikes: 0,
        userDisliked: null,
        userLiked: null,
        createdAt: message.createdAt,
      };

      ee.emit("addMessage", roomId, messageToEmit);

      return message;
    }),
  likeOrDislike: authedProcedure
    .input(
      z.object({
        userName: z.string().optional().nullable(),
        messageId: z.string().uuid(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input }) => {
      await messageService.likeOrDislike(
        input.messageId,
        input.reactionType,
        input.userName
      );

      const messageWithReactions =
        await messageService.getMessageWithReactionsById(
          input.messageId,
          input.userName
        );
      ee.emit("addLikeOrDislike", messageWithReactions);
    }),
  undoLikeOrDislike: authedProcedure
    .input(
      z.object({
        userName: z.string().optional().nullable(),
        messageId: z.string().uuid(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input }) => {
      await messageService.undoLikeOrDislike(
        input.messageId,
        input.reactionType,
        input.userName
      );
      const messageWithReactions =
        await messageService.getMessageWithReactionsById(
          input.messageId,
          input.userName
        );
      ee.emit("addLikeOrDislike", messageWithReactions);
    }),

  infinite: authedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        userName: z.string().optional().nullable(),
        cursor: z.date().nullish(),
        take: z.number().min(1).max(50).nullish(),
      })
    )
    .query(async ({ input }) => {
      const take = input.take ?? 20;
      const cursor = input.cursor;

      const page = await messageService.getInfinite(
        input.roomId,
        take,
        cursor,
        input.userName
      );
      const items = page.reverse();
      let nextCursor: typeof cursor | null = null;
      if (items.length > take) {
        const prev = items.shift();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = prev!.createdAt;
      }
      return {
        items,
        nextCursor,
      };
    }),
  onAdd: authedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        userName: z.string().optional().nullable(),
        // lastEventId is the last event id that the client has received
        // On the first call, it will be whatever was passed in the initial setup
        // If the client reconnects, it will be the last event id that the client received
        lastEventId: z.string().nullish(),
      })
    )
    .subscription(async function* (opts) {
      // We start by subscribing to the event emitter so that we don't miss any new events while fetching
      const iterable = ee.toIterable("addMessage", {
        signal: opts.signal,
      });

      // Fetch the last message createdAt based on the last event id
      let lastMessageCreatedAt = await (async () => {
        const lastEventId = opts.input.lastEventId;
        if (!lastEventId) return null;

        const itemById = await messageService.getById(lastEventId);
        return itemById?.createdAt ?? null;
      })();

      const newPostsSinceLastMessage =
        await messageService.getNewMessagesSinceTargetDate(
          opts.input.roomId,
          lastMessageCreatedAt
        );

      function* maybeYield(message: FetchedMessage) {
        if (message.roomId !== opts.input.roomId) {
          // ignore posts from other channels - the event emitter can emit from other channels
          return;
        }
        if (lastMessageCreatedAt && message.createdAt <= lastMessageCreatedAt) {
          // ignore posts that we've already sent - happens if there is a race condition between the query and the event emitter
          return;
        }

        yield tracked(message.id, message);

        // update the cursor so that we don't send this post again
        lastMessageCreatedAt = message.createdAt;
      }

      // yield the messages we fetched from the db
      for (const message of newPostsSinceLastMessage) {
        yield* maybeYield(message);
      }

      // yield any new messages from the event emitter
      for await (const [, message] of iterable) {
        yield* maybeYield(message);
      }
    }),
  onLikeOrDislike: authedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      })
    )
    .subscription(async function* (opts) {
      // We start by subscribing to the event emitter so that we don't miss any new events while fetching
      const iterable = ee.toIterable("addLikeOrDislike", {
        signal: opts.signal,
      });

      function* maybeYield(message: Partial<FetchedMessage> | null) {
        if (!message) return;
        if (message.roomId !== opts.input.roomId) {
          // ignore posts from other channels - the event emitter can emit from other channels
          return;
        }
        yield tracked(message.id!, message);
      }

      // yield any new messages from the event emitter
      for await (const [message] of iterable) {
        yield* maybeYield(message);
      }
    }),
});
