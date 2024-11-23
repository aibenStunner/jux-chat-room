import EventEmitter, { on } from "node:events";

export interface FetchedMessage {
  id: string;
  roomId: string;
  text: string;
  userName: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  userLiked: boolean | null;
  userDisliked: boolean | null;
}

export type WhoIsTyping = Record<string, { lastTyped: Date }>;

export interface MyEvents {
  addMessage: (roomId: string, data: FetchedMessage) => void;
  addLikeOrDislike: (data: Partial<FetchedMessage> | null) => void;

  isTypingUpdate: (roomId: string, who: WhoIsTyping) => void;
  joinOrLeave: (who: {
    userName: string | null | undefined;
    action: string;
    roomId: string;
  }) => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {
  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
    opts: NonNullable<Parameters<typeof on>[2]>
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    return on(this, event, opts) as any;
  }
}

export const ee = new MyEventEmitter();
