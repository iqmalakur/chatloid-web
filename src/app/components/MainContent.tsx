import useChatList from "@/hooks/useChatList";
import useChatRoom from "@/hooks/useChatRoom";
import { useState } from "react";
import ChatList from "./ChatList";
import ContactList from "./ContactList";
import ChatRoom from "./ChatRoom";

interface MainContentProps {
  listType: "chat" | "contact";
}

export default function MainContent({ listType }: MainContentProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { rooms, onMessageUpdate } = useChatList();
  const { chat, messages } = useChatRoom(selectedRoom, onMessageUpdate);

  return (
    <main className="flex h-screen flex-1">
      <div
        className={`h-full w-full border-r border-gray-200 md:w-1/3 lg:w-1/4 ${selectedRoom !== null ? "hidden md:flex" : "flex"} flex-col`}
      >
        {listType === "chat" ? (
          <ChatList rooms={rooms} onSelectRoom={(id) => setSelectedRoom(id)} />
        ) : (
          <ContactList />
        )}
      </div>

      <div
        className={`h-full w-full md:w-2/3 lg:w-3/4 ${selectedRoom === null ? "hidden md:flex" : "flex"} flex-col`}
      >
        {selectedRoom ? (
          <ChatRoom chat={chat} messages={messages} />
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
  );
}
