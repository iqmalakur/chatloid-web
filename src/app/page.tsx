"use client";

import { useState } from "react";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import ContactList from "./components/ContactList";

export default function Home() {
  const { user } = useAuth();

  const [listType, setListType] = useState<"chat" | "contact">("chat");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar
        picture={user?.picture}
        name={user?.name}
        onChatMenuClick={() => setListType("chat")}
        onContactMenuClick={() => setListType("contact")}
      />

      <main className="flex h-screen flex-1">
        <div
          className={`h-full w-full border-r border-gray-200 md:w-1/3 lg:w-1/4 ${selectedRoom !== null ? "hidden md:flex" : "flex"} flex-col`}
        >
          {listType === "chat" ? (
            <ChatList onSelectRoom={(id) => setSelectedRoom(id)} />
          ) : (
            <ContactList />
          )}
        </div>

        <div
          className={`h-full w-full md:w-2/3 lg:w-3/4 ${selectedRoom === null ? "hidden md:flex" : "flex"} flex-col`}
        >
          {selectedRoom ? (
            <ChatRoom id={selectedRoom} />
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
