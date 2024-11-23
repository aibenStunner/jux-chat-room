"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Button } from "./ui/button";

export function JoinRoomButton({
  roomId,
  userName,
}: {
  roomId: string;
  userName: string | null | undefined;
}) {
  const router = useRouter();
  const mutation = trpc.room.join.useMutation({
    onSuccess: () => {
      router.push(`/rooms/${roomId}`);
      router.refresh();
    },
    onError(err) {
      alert("Error: " + err.message);
    },
  });

  return (
    <Button
      onClick={() => {
        mutation.mutate({ roomId, userName });
      }}
    >
      Join Room
    </Button>
  );
}
