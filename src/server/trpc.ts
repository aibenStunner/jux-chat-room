import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
  sse: {
    maxDurationMs: 5 * 60 * 1_000,
    ping: {
      enabled: true,
      intervalMs: 3_000,
    },
    client: {
      reconnectAfterInactivityMs: 5_000,
    },
  },
});

export const publicProcedure = t.procedure;

export const authedProcedure = publicProcedure.use(function isAuthed(opts) {
  return opts.next({
    ctx: "authed context",
  });
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;
