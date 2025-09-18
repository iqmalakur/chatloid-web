"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import MainContent from "./components/MainContent";

export default function Home() {
  const { user } = useAuth();

  const [listType, setListType] = useState<"chat" | "contact">("chat");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar
        picture={user?.picture}
        name={user?.name}
        onChatMenuClick={() => setListType("chat")}
        onContactMenuClick={() => setListType("contact")}
      />

      <SocketProvider>
        <MainContent listType={listType} />
      </SocketProvider>
    </div>
  );
}
