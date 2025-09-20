"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import MainContent from "./components/MainContent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ListType } from "@/types/ListType";

export default function Home() {
  const { user } = useAuth();

  const [listType, setListType] = useState<ListType>("chat");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { isMobile } = useIsMobile();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar
        picture={user?.picture}
        name={user?.name}
        listType={listType}
        onChatMenuClick={() => {
          setListType("chat");
          if (isMobile) setSelectedRoom(null);
        }}
        onContactMenuClick={() => {
          setListType("contact");
          if (isMobile) setSelectedRoom(null);
        }}
        onNotificationMenuClick={() => {
          setListType("notification");
          if (isMobile) setSelectedRoom(null);
        }}
      />

      <SocketProvider>
        <MainContent
          listType={listType}
          selectedRoom={selectedRoom}
          onSelectedRoom={(id) => setSelectedRoom(id)}
          onRoomCreated={(id) => {
            setSelectedRoom(id);
            setListType("chat");
          }}
        />
      </SocketProvider>
    </div>
  );
}
