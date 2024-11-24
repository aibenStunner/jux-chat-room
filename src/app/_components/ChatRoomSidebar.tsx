"use client";

import { RoomType } from "@/db/schema";
import { Button } from "./ui/button";

import Link from "next/link";

interface ChatRoomSidebarProps {
  rooms: (Partial<RoomType> & { userCount: number })[];
  roomId: string;
  isLoggedIn: boolean;
  user: string | null | undefined;
}

export function ChatRoomSidebar({
  rooms,
  roomId,
  isLoggedIn,
  user,
}: ChatRoomSidebarProps) {
  return (
    <div className="flex flex-col h-full w-64 border-r bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
      <div className="flex flex-1 flex-col overflow-y-scroll h-[calc(100vh-8rem)] no-scrollbar">
        {rooms.map((room) => (
          <div key={room.id} className="mb-2">
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <Button
                variant={roomId === room.id ? "secondary" : "outline"}
                className="w-full justify-start"
                disabled={!isLoggedIn && roomId !== room.id}
              >
                {room.name}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {isLoggedIn && !!user && (
        <div className="flex-shrink-0 absolute bottom-0 w-64 left-0 p-4 bg-gray-200 text-center">
          Hello, {user} 👋
        </div>
      )}
    </div>
  );
}
