"use client";

import { useState } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import Sidebar from "./Sidebar";
import User from "@/entities/User";

interface ChatLayoutProps {
  user: User;
}

export default function ChatLayout({ user }: ChatLayoutProps) {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar />

      <main className="flex h-screen flex-1">
        <div
          className={`h-full w-full border-r border-gray-200 md:w-1/3 lg:w-1/4 ${selectedRoom !== null ? "hidden md:flex" : "flex"} flex-col`}
        >
          <ChatList onSelectRoom={(id) => setSelectedRoom(id)} />
        </div>

        <div
          className={`h-full w-full md:w-2/3 lg:w-3/4 ${selectedRoom === null ? "hidden md:flex" : "flex"} flex-col`}
        >
          {selectedRoom ? (
            <ChatRoom
              friend={{
                id: 1,
                name: "Alice",
                avatar: "https://i.pravatar.cc/150?img=1",
                online: true,
              }}
              initialMessages={[
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
              ]}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              Pilih chat untuk memulai
            </div>
          )}

          {selectedRoom !== null && (
            <button
              className="border-t p-3 text-blue-500 md:hidden"
              onClick={() => setSelectedRoom(null)}
            >
              ← Kembali
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
