"use client";

import { MessageType } from "@/db/schema";
import { cx } from "class-variance-authority";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { format, formatDistanceToNow, isToday } from "date-fns";

import { getInitials } from "./utils";
import { Button } from "./ui/button";
import { trpc } from "../_trpc/client";

interface ChatMessageProps {
  message: Partial<MessageType> & {
    likes: number;
    dislikes: number;
    userLiked: boolean;
    userDisliked: boolean;
  };
  isMe: boolean;
  userName: string | null | undefined;
}

export function ChatMessage({ message, isMe, userName }: ChatMessageProps) {
  const likeOrDislikeMessage = trpc.message.likeOrDislike.useMutation();
  const undoLikeOrDislikeMessage = trpc.message.undoLikeOrDislike.useMutation();

  function handleLikeOrDislikeMessage(reactionType: "like" | "dislike") {
    const input = {
      userName,
      messageId: message.id!,
      reactionType,
    };

    likeOrDislikeMessage.mutate(input, {
      onError(error) {
        alert(error.message);
      },
    });
  }

  function handleUndoLikeOrDislikeMessage(reactionType: "like" | "dislike") {
    const input = {
      userName,
      messageId: message.id!,
      reactionType,
    };

    undoLikeOrDislikeMessage.mutate(input, {
      onError(error) {
        alert(error.message);
      },
    });
  }

  return (
    <div
      key={message.id}
      className={cx(
        "flex items-start gap-3",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <Avatar>
        <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <div
          className={cx(
            "rounded-lg bg-gray-100 p-3 text-sm",
            isMe ? "bg-gray-300 " : "bg-gray-200 "
          )}
        >
          <p>{message.text}</p>
        </div>
        <div className="flex flex-row text-xs text-gray-500">
          <p className="hover:underline text-gray-700">{message.userName}</p>
          &nbsp;·&nbsp;
          {isToday(message.createdAt!)
            ? formatDistanceToNow(message.createdAt!) + " ago"
            : format(message.createdAt!, "MMM d, yyyy h:mm a")}
        </div>

        <div className="flex mt-1">
          <Button
            variant="outline"
            className="mr-1 h-6 w-h-4 rounded-md px-3 text-xs"
            disabled={isMe}
            onClick={() =>
              message.userLiked
                ? handleUndoLikeOrDislikeMessage("like")
                : handleLikeOrDislikeMessage("like")
            }
          >
            <ThumbsUp className="mr-0.5 h-3 w-3" />
            {message.likes || 0}
          </Button>
          <Button
            variant="outline"
            className="h-6 w-h-4 rounded-md px-3 text-xs"
            disabled={isMe}
            onClick={() =>
              message.userDisliked
                ? handleUndoLikeOrDislikeMessage("dislike")
                : handleLikeOrDislikeMessage("dislike")
            }
          >
            <ThumbsDown className="mr-0.5 h-3 w-3" />
            {message.dislikes || 0}
          </Button>
        </div>
      </div>
    </div>
  );
}
