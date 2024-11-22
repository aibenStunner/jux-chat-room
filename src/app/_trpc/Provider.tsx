"use client";

import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./queryClient";
import { trpc } from "./client";

import SuperJSON from "superjson";

const getUrl = () => {
  const base = (() => {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.APP_URL) return process.env.APP_URL;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();

  return `${base}/api/trpc`;
};

export function TRPCProviders(props: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => getQueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: unstable_httpSubscriptionLink({
            url: getUrl(),
            transformer: SuperJSON,
          }),
          false: httpBatchLink({
            url: getUrl(),
            transformer: SuperJSON,
          }),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
