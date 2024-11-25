# Jux Chat Room

A real-time chat room application where users can send messages and react to messages.

## Technical Stack

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
cp .env.example .env   # set db user, db password, db table
pnpm migrate
pnpm seed # seed database with chat rooms
pnpm dev
```

## Features implemented

- Authentication with [next-auth](https://next-auth.js.org/)
- User persistence in database
- Seed database with 5 chatrooms
- List all available chatrooms with name, current user count, creation timestamp
- Join or Leave chatroom
- Users can send messages to multiple chatrooms
- Users can view messages in all chatrooms they have joined.
- Like and dislike reactions
- More than one user can react to a message
- Reaction count
- User left room
- User joined room
- User is typing
