import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { RoomType } from "@/db/schema";

export function ChatRoomCard({
  room,
}: {
  room: Partial<RoomType> & { userCount: number };
}) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-1">
            Users: {room.userCount}
          </p>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(room.createdAt!).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
