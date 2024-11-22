import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  console.log("createContext");

  return {
    context: "context",
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
