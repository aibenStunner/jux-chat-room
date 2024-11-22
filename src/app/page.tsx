import { caller } from "@/server/routers/_app";

export default async function Home() {
  const healthCheck = await caller.healthCheck();

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Jux Chat Room</p>
      <p>{healthCheck}</p>
    </div>
  );
}
