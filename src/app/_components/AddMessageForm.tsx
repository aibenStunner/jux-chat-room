"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import React from "react";
import { trpc } from "../_trpc/client";
import { SendHorizonal } from "lucide-react";

export function AddMessageForm(props: {
  onMessagePost: () => void;
  roomId: string;
}) {
  const { roomId } = props;
  const addMessage = trpc.message.add.useMutation();

  const [message, setMessage] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  function postMessage() {
    const input = {
      text: message,
      roomId,
    };
    setMessage("");
    addMessage.mutate(input, {
      onSuccess() {
        props.onMessagePost();
      },
      onError(error) {
        alert(error.message);
        setMessage(input.text);
      },
    });
  }

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postMessage();
        }}
      >
        <Textarea
          className="pr-12"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={message.split(/\r|\n/).length}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !!message.trim()) {
              e.preventDefault();
              postMessage();
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
        />
        <Button
          className="absolute right-2 top-2"
          size="lg"
          type="submit"
          disabled={!message.trim()}
        >
          <SendHorizonal />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
