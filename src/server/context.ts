import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "./services/auth";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth();

  console.log(
    `[INFO] context created for ${session?.user?.name ?? "unknown user"}`
  );

  return {
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
