import Link from "next/link";

import { caller } from "@/server/routers/_app";
import { SignedIn, SignedOut } from "@/server/services/auth";

import { Button } from "./_components/ui/button";
import { ChatRoomCard } from "./_components/ChatRoomCard";
import { CreateChatRoom } from "./_components/CreateChatRoom";

export default async function Home() {
  const rooms = await caller.room.list();

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jux Chat Room</h1>
          <Button>
            <SignedOut>
              <Link href="/api/auth/signin">Sign In</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/api/auth/signout">Sign Out</Link>
            </SignedIn>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Chat Rooms</h2>
          <SignedIn>
            <CreateChatRoom />
          </SignedIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <ChatRoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
}
