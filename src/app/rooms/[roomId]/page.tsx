import { ChatRoom } from "@/app/_components/ChatRoom";
import { JoinRoomButton } from "@/app/_components/JoinRoomButton";
import { caller } from "@/server/routers/_app";
import { auth, SignedIn, SignedOut } from "@/server/services/auth";
import { Suspense } from "react";

export default async function Home(
  props: Readonly<{ params: Promise<{ roomId: string }> }>
) {
  const session = await auth();
  const { roomId } = await props.params;
  const joinedRoom = await caller.user.hasJoinedRoom({
    userName: session?.user?.name,
    roomId,
  });

  return (
    <Suspense
      fallback={
        <div className="flex h-full flex-1 flex-row items-center justify-center italic">
          Loading....
        </div>
      }
    >
      {joinedRoom ? (
        <ChatRoom roomId={roomId} userName={session?.user?.name} />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-xl text-gray-500">
            <SignedOut>Please sign in to view messages in chat room</SignedOut>
            {!!roomId ? (
              !joinedRoom && (
                <SignedIn>
                  <div className="flex flex-col items-center p-4">
                    <p className="mb-2">Join the room to view messages</p>
                    <JoinRoomButton
                      roomId={roomId}
                      userName={session?.user?.name}
                    />
                  </div>
                </SignedIn>
              )
            ) : (
              <SignedIn>Select a room to start chatting</SignedIn>
            )}
          </div>
        </div>
      )}
    </Suspense>
  );
}
