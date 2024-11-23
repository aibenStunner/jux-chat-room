"use client";

import { useRouter } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Button } from "./ui/button";

export function LeaveRoomButton({
  roomId,
  userName,
}: {
  roomId: string;
  userName: string | null | undefined;
}) {
  const router = useRouter();
  const mutation = trpc.room.leave.useMutation({
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
      variant="outline"
      onClick={() => {
        mutation.mutate({ roomId, userName });
      }}
    >
      Leave Room
    </Button>
  );
}
