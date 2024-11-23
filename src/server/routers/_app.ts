import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { cache } from "react";
import type { Context } from "../context";
import { publicProcedure, router } from "../trpc";
import { auth } from "../services/auth";

import { roomRouter } from "./rooms/router";
import { userRouter } from "./users/router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "yay!"),

  room: roomRouter,
  user: userRouter,
});

const createCallerContext = cache(
  async (): Promise<Context> => ({
    session: await auth(),
  })
);

export type AppRouter = typeof appRouter;
export const caller = createCallerFactory()(appRouter)(createCallerContext);
