import { z } from "zod";
import type { NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cache } from "react";

import UserService from "../routers/users/Service";

const userService = new UserService();

const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: "jux",
      name: "Jux",
      async authorize(input) {
        const credentialsSchema = z.object({
          name: z.string().min(1),
        });
        const parseResult = credentialsSchema.safeParse(input);
        if (!parseResult.success) {
          console.error("Invalid credentials");
          return null;
        }

        const credentials = parseResult.data;
        const name = credentials.name;

        await userService.addUser(name);

        return {
          name,
        } as User;
      },
      credentials: {
        name: { type: "string", label: "Enter your name" },
      },
    }),
  ],
};

export const {
  handlers,
  auth: uncachedAuth,
  signIn,
  signOut,
} = NextAuth(authOptions);
export const auth = cache(uncachedAuth);

export async function SignedIn(props: {
  children:
    | React.ReactNode
    | ((props: { user: Session["user"] }) => React.ReactNode);
}) {
  const sesh = await auth();
  return sesh?.user ? (
    <>
      {typeof props.children === "function"
        ? props.children({ user: sesh.user })
        : props.children}
    </>
  ) : null;
}

export async function SignedOut(props: { children: React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? null : <>{props.children}</>;
}
