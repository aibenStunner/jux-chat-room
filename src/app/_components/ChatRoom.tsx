"use client";

import { trpc } from "../_trpc/client";
import { LeaveRoomButton } from "./LeaveRoomButton";

interface ChatRoomProps {
  roomId: string;
  userName: string | null | undefined;
}

export function ChatRoom({ roomId, userName }: ChatRoomProps) {
  const room = trpc.room.get.useQuery({ roomId });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">{room.data?.name}</h2>
        <LeaveRoomButton roomId={roomId} userName={userName} />
      </div>
    </div>
  );
}
