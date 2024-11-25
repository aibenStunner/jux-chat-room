"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { trpc } from "../_trpc/client";
import { useStore } from "../_store";

export function AuthButton() {
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const signIn = trpc.user.signIn.useMutation();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      signIn.mutate(
        { name },
        {
          onSuccess: (user) => {
            setName("");
            setCurrentUser(user);

            // set cookie to be accessed by trpc server client
            document.cookie = `user=${JSON.stringify(user)}; path=/;`;
          },
          onError(error) {
            alert(error.message);
          },
        }
      );
      setDialogOpen(false);
    }
  };

  const handleSignOut = () => {
    setName("");
    setCurrentUser({});

    // set cookie
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <SignedIn>
        <DialogTrigger asChild>
          <Button>Sign Out</Button>
        </DialogTrigger>
      </SignedIn>
      <SignedOut>
        <DialogTrigger asChild>
          <Button>Sign In</Button>
        </DialogTrigger>
      </SignedOut>

      <SignedOut>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
                aria-invalid={name.trim().length === 0}
              />
              {name.trim().length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Enter a valid username
                </p>
              )}
            </div>
            <Button type="submit" disabled={name.trim().length === 0}>
              Sign In
            </Button>
          </form>
        </DialogContent>
      </SignedOut>

      <SignedIn>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignOut} className="space-y-4">
            <p>Are you sure you want to sign out?</p>
            <Button type="submit">Sign Out</Button>
          </form>
        </DialogContent>
      </SignedIn>
    </Dialog>
  );
}

export function SignedIn(props: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);

  return currentUser?.name ? <>{props.children}</> : null;
}

export function SignedOut(props: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  return currentUser?.name ? null : <>{props.children}</>;
}
