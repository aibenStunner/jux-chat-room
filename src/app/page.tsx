import Link from "next/link";

import { ChatRoomCard } from "./_components/ChatRoomCard";
import { Button } from "./_components/ui/button";

import { defaultChatRooms } from "./_data/defaultChatRooms";
import { SignedIn, SignedOut } from "@/server/services/auth";

export default async function Home() {
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
        <h2 className="text-xl font-semibold mb-6">Chat Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultChatRooms.map((room) => (
            <ChatRoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
}
