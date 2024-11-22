import { QueryClient } from "@tanstack/react-query";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // with SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
    },
  });

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // server: always make a new query client
    return createQueryClient();
  } else {
    // browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};
