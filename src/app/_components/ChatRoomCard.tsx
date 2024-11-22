import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChatRoom } from "../_data/defaultChatRooms";
import Link from "next/link";

export function ChatRoomCard({ room }: { room: ChatRoom }) {
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
            Created: {new Date(room.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
