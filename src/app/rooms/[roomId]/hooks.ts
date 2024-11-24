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
      { roomId },
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

export function useThrottledIsTypingMutation(roomId: string) {
  const isTyping = trpc.room.isTyping.useMutation();

  return React.useMemo(() => {
    let state = false;
    let timeout: ReturnType<typeof setTimeout> | null;
    function trigger() {
      if (timeout) clearTimeout(timeout);
      timeout = null;

      isTyping.mutate({ typing: state, roomId });
    }

    return (nextState: boolean) => {
      const shouldTriggerImmediately = nextState !== state;

      state = nextState;
      if (shouldTriggerImmediately) {
        trigger();
      } else if (!timeout) {
        timeout = setTimeout(trigger, 1000);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
}

export function useWhoJoinedOrLeft(roomId: string) {
  const [whoJoinedOrLeft, setWhoJoinedOrLeft] = React.useState<{
    userName: string | null | undefined;
    action: string;
    roomId: string;
  } | null>(null);

  React.useEffect(() => {
    if (whoJoinedOrLeft) {
      const timer = setTimeout(() => {
        setWhoJoinedOrLeft(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [whoJoinedOrLeft]);

  trpc.room.onJoinOrLeave.useSubscription(
    {
      roomId,
    },
    {
      onData(event) {
        setWhoJoinedOrLeft(event.data);
      },
      onError(err) {
        console.error("Subscription error:", err);
      },
    }
  );

  return { whoJoinedOrLeft };
}
