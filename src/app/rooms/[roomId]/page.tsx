import { Suspense } from "react";

export default async function Home(
  props: Readonly<{ params: Promise<{ roomId: string }> }>
) {
  const { roomId } = await props.params;

  return (
    <Suspense
      fallback={
        <div className="flex h-full flex-1 flex-row items-center justify-center italic">
          Loading....
        </div>
      }
    >
      <div className="flex justify-center items-center text-lg font-bold">
        Chat Room {roomId}
      </div>
    </Suspense>
  );
}
