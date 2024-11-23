import { ChatRoomSidebar } from "@/app/_components/ChatRoomSidebar";
import { CreateChatRoom } from "@/app/_components/CreateChatRoom";
import { Button } from "@/app/_components/ui/button";
import { auth, SignedIn, SignedOut } from "@/server/services/auth";
import Link from "next/link";
import { caller } from "@/server/routers/_app";

export default async function Home(
  props: Readonly<{
    params: Promise<{ roomId: string }>;
    children: React.ReactNode;
  }>
) {
  const session = await auth();
  const { roomId } = await props.params;
  const rooms = await caller.room.list();

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex-shrink-0 p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">Jux Chat Room</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <CreateChatRoom />
            </SignedIn>
            <Button>
              <SignedOut>
                <Link href="/api/auth/signin">Sign In</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/api/auth/signout">Sign Out</Link>
              </SignedIn>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ChatRoomSidebar
          rooms={rooms}
          roomId={roomId}
          isLoggedIn={!!session?.user?.name}
          user={session?.user?.name}
        />
        <main className="flex-1 overflow-hidden">{props.children}</main>
      </div>
    </div>
  );
}
