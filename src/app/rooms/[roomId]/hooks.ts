import * as React from "react";

import { trpc } from "@/app/_trpc/client";
import { skipToken } from "@tanstack/react-query";

export function useLivePosts(
  roomId: string,
  userName: string | null | undefined
) {
  const [, query] = trpc.message.infinite.useSuspenseInfiniteQuery(
    { roomId, userName },
    {
      getNextPageParam: (d) => d.nextCursor,
      // No need to refetch as we have a subscription
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const [messages, setMessages] = React.useState(() => {
    const msgs = query.data?.pages.map((page) => page.items).flat();
    return msgs ?? null;
  });
  type Message = NonNullable<typeof messages>[number];

  /**
   * fn to add and dedupe new messages onto state
   */
  const addMessages = React.useCallback((incoming?: Message[]) => {
    setMessages((current) => {
      const map: Record<Message["id"], Message> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);

  /**
   * when new data from `useInfiniteQuery`, merge with current state
   */
  React.useEffect(() => {
    const msgs = query.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [query.data?.pages, addMessages]);

  const [lastEventId, setLastEventId] = React.useState<
    // Query has not been run yet
    | false
    // Empty list
    | null
    // Event id
    | string
  >(false);
  if (messages && lastEventId === false) {
    // We should only set the lastEventId once, if the SSE-connection is lost, it will automatically reconnect and continue from the last event id
    // Changing this value will trigger a new subscription
    setLastEventId(messages.at(-1)?.id ?? null);
  }
  const messageSubscription = trpc.message.onAdd.useSubscription(
    lastEventId === false ? skipToken : { roomId, lastEventId, userName },
    {
      onData(event) {
        addMessages([event.data]);
      },
      onError(err) {
        console.error("Subscription error:", err);

        const lastMessageEventId = messages?.at(-1)?.id;
        if (lastMessageEventId) {
          // We've lost the connection, let's resubscribe from the last message
          setLastEventId(lastMessageEventId);
        }
      },
    }
  );
  const likeOrDislikeSubscription =
    trpc.message.onLikeOrDislike.useSubscription(
      { roomId, userName },
      {
        onData(event) {
          addMessages([event.data]);
        },
        onError(err) {
          console.error("Subscription error:", err);

          const lastMessageEventId = messages?.at(-1)?.id;
          if (lastMessageEventId) {
            // We've lost the connection, let's resubscribe from the last message
            setLastEventId(lastMessageEventId);
          }
        },
      }
    );
  return {
    query,
    messages,
    messageSubscription,
    likeOrDislikeSubscription,
  };
}
