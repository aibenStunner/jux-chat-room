import { authedProcedure, router } from "@/server/trpc";
import { z } from "zod";
import MessageService from "./Service";

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

      const post = await messageService.insert(text, ctx.user.name, roomId, id);

      return post;
    }),
  likeOrDislike: authedProcedure
    .input(
      z.object({
        userName: z.string().optional().nullable(),
        messageId: z.string().uuid(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await messageService.likeOrDislike(
        input.messageId,
        input.reactionType,
        input.userName
      );
    }),
  undoLikeOrDislike: authedProcedure
    .input(
      z.object({
        userName: z.string().optional().nullable(),
        messageId: z.string().uuid(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await messageService.undoLikeOrDislike(
        input.messageId,
        input.reactionType,
        input.userName
      );
    }),
});
