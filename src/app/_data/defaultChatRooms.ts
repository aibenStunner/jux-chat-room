export interface ChatRoom {
  id: string;
  name: string;
  userCount: number;
  createdAt: string;
}

export const defaultChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "General",
    userCount: 42,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Tech Talk",
    userCount: 28,
    createdAt: "2023-02-15T12:30:00Z",
  },
  {
    id: "3",
    name: "Music Lovers",
    userCount: 35,
    createdAt: "2023-03-10T18:45:00Z",
  },
  {
    id: "4",
    name: "Book Club",
    userCount: 15,
    createdAt: "2023-04-05T09:15:00Z",
  },
  {
    id: "5",
    name: "Gaming Zone",
    userCount: 50,
    createdAt: "2023-05-20T21:00:00Z",
  },
];
