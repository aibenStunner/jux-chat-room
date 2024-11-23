"use client";

import { trpc } from "../_trpc/client";
import { LeaveRoomButton } from "./LeaveRoomButton";
import { ChatMessage } from "./ChatMessage";
import { AddMessageForm } from "./AddMessageForm";
import React from "react";
import { useLivePosts, useWhoJoinedOrLeft } from "../rooms/[roomId]/hooks";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { Button } from "./ui/button";
import { listWithAnd, pluralize } from "./utils";

interface ChatRoomProps {
  roomId: string;
  userName: string | null | undefined;
}

export function ChatRoom({ roomId, userName }: ChatRoomProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const livePosts = useLivePosts(roomId, userName);
  const currentlyTyping = trpc.room.whoIsTyping.useSubscription({
    roomId,
  });
  const { whoJoinedOrLeft } = useWhoJoinedOrLeft(roomId);
  const room = trpc.room.get.useQuery({ roomId });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">{room.data?.name}</h2>
            <SubscriptionStatus subscription={livePosts.messageSubscription} />
          </div>
          {whoJoinedOrLeft && whoJoinedOrLeft.userName !== userName && (
            <p className="text-sm text-blue-800">
              <span className="italic">{whoJoinedOrLeft.userName}</span>{" "}
              {whoJoinedOrLeft.action} the room
            </p>
          )}
          <LeaveRoomButton roomId={roomId} userName={userName} />
        </div>
      </div>
      <div className="flex flex-1 flex-col-reverse overflow-y-scroll">
        <div className="p-4 space-y-6">
          <div className="flex justify-center">
            <Button
              disabled={
                !livePosts.query.hasNextPage ||
                livePosts.query.isFetchingNextPage
              }
              onClick={() => {
                void livePosts.query.fetchNextPage();
              }}
            >
              {livePosts.query.isFetchingNextPage
                ? "Loading..."
                : !livePosts.query.hasNextPage
                ? "Fetched everything!"
                : "Load more"}
            </Button>
          </div>

          {livePosts.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              userName={userName}
              isMe={userName === message.userName}
            />
          ))}
        </div>
      </div>
      <p className="text-sm italic text-gray-500 mb-2 ml-5 mt-6">
        {currentlyTyping.data?.length &&
        !currentlyTyping.data.includes(userName) ? (
          `${listWithAnd(currentlyTyping.data)} ${pluralize(
            currentlyTyping.data.length,
            "is",
            "are"
          )} typing...`
        ) : (
          <>&nbsp;</>
        )}
      </p>
      <div className="flex-shrink-0">
        <AddMessageForm
          roomId={roomId}
          onMessagePost={() => {
            scrollRef.current?.scroll({
              // `top: 0` is actually the bottom of the chat due to `flex-col-reverse`
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      </div>
    </div>
  );
}
