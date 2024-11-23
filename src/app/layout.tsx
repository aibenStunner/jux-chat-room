import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TRPCProviders } from "./_trpc/Provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/services/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jux Chat Room",
  description: "Colaborative Activity Chat Room",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <TRPCProviders>{children}</TRPCProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
