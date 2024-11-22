import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { cache } from "react";
import type { Context } from "../context";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "yay!"),
});

const createCallerContext = cache(
  async (): Promise<Context> => ({
    context: "context",
  })
);

export type AppRouter = typeof appRouter;
export const caller = createCallerFactory()(appRouter)(createCallerContext);
