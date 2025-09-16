// dummyUsers.ts

export interface ChatMessage {
  id: number;
  sender: "me" | "friend";
  content: string;
  timestamp: Date;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  chats: ChatMessage[];
}

export const dummyUsers: User[] = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    chats: [
      {
        id: 1,
        sender: "friend",
        content: "Halo, apa kabar?",
        timestamp: new Date(Date.now() - 86400000), // kemarin
      },
      {
        id: 2,
        sender: "me",
        content: "Baik, kamu?",
        timestamp: new Date(),
      },
      {
        id: 3,
        sender: "friend",
        content: "Aku juga baik 😄",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    chats: [
      {
        id: 1,
        sender: "friend",
        content: "Besok jadi meeting kan?",
        timestamp: new Date(Date.now() - 2 * 86400000), // 2 hari lalu
      },
      {
        id: 2,
        sender: "me",
        content: "Iya, jam 10 ya?",
        timestamp: new Date(Date.now() - 2 * 86400000 + 3600000),
      },
      {
        id: 3,
        sender: "friend",
        content: "Sip, sampai ketemu!",
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
  },
  {
    id: 3,
    name: "Charlie",
    avatar: "https://i.pravatar.cc/150?img=3",
    chats: [
      {
        id: 1,
        sender: "friend",
        content: "Lagi di mana?",
        timestamp: new Date(),
      },
      {
        id: 2,
        sender: "me",
        content: "Baru pulang kerja, capek banget 😅",
        timestamp: new Date(),
      },
    ],
  },
];
