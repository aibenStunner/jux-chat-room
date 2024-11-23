# Jux Chat Room

A real-time chat room application where users can send messages and react to messages.

## Features

- Full-Stack React with Next.js
- Database with [Drizzle](https://orm.drizzle.team/) (Postgres)
- e2e type safety with [tRPC](https://trpc.io)
- State management with [Zustand](https://zustand.docs.pmnd.rs/)
- trpc Subscription support
- Authorization using [next-auth](https://next-auth.js.org/)

## Setup

```sh
git clone git@github.com:aibenStunner/jux-chat-room.git && cd jux-chat-room
pnpm i
cp .env.example .env
pnpm seed # seed database with chat rooms
pnpm dev
```
