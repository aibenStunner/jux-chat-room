import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    router: appRouter,
    req,
    endpoint: "/api/trpc",
    createContext,
    onError({ error }) {
      if (error.code === "INTERNAL_SERVER_ERROR")
        console.error("Something went wrong", error);
    },
  });

export const GET = handler;
export const POST = handler;
