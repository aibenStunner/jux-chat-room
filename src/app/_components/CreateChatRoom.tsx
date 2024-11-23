"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function CreateChatRoom() {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const session = useSession().data;

  const mutation = trpc.room.create.useMutation({
    onSuccess: (id) => {
      router.push(`/rooms/${id}`);
      router.refresh();
    },
    onError(err) {
      alert("Error: " + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (session?.user?.name)
      mutation.mutate({ roomName, userName: session.user.name });
    else alert("User unauthorized");

    setRoomName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Chat Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat Room</DialogTitle>
          <DialogDescription>
            Enter a name for your new chat room. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-name" className="text-right">
                Room Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  aria-invalid={roomName.trim().length === 0}
                />
                {roomName.trim().length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Room name cannot be empty
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={roomName.trim().length === 0}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
