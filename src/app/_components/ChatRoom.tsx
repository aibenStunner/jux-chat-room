"use client";

import { ScrollArea } from "./ui/scroll-area";
import { trpc } from "../_trpc/client";
import { LeaveRoomButton } from "./LeaveRoomButton";
import { ChatMessage } from "./ChatMessage";
import { AddMessageForm } from "./AddMessageForm";
import React from "react";

interface ChatRoomProps {
  roomId: string;
  userName: string | null | undefined;
}

export function ChatRoom({ roomId, userName }: ChatRoomProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const room = trpc.room.get.useQuery({ roomId });
  const messages = trpc.message.list.useQuery({ roomId, userName });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{room.data?.name}</h2>
          <LeaveRoomButton roomId={roomId} userName={userName} />
        </div>
      </div>
      <ScrollArea ref={scrollRef} className="flex-grow">
        <div className="p-4 space-y-6">
          {messages?.data?.length &&
            messages.data.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userName={userName}
                isMe={userName === message.userName}
              />
            ))}
        </div>
      </ScrollArea>
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
