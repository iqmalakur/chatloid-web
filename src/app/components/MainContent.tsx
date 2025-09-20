import useChatList from "@/hooks/useChatList";
import useChatRoom from "@/hooks/useChatRoom";
import ChatList from "./ChatList";
import ContactList from "./ContactList";
import ChatRoom from "./ChatRoom";
import { ListType } from "@/types/ListType";

interface MainContentProps {
  listType: ListType;
  selectedRoom: string | null;
  onSelectedRoom: (id: string | null) => void;
  onRoomCreated: (id: string) => void;
}

export default function MainContent({
  listType,
  selectedRoom,
  onSelectedRoom,
  onRoomCreated,
}: MainContentProps) {
  const { rooms, onMessageUpdate, onUpdateRoom } = useChatList();
  const { chat, messages } = useChatRoom(selectedRoom, onMessageUpdate);

  return (
    <main className="flex h-screen flex-1">
      <div
        className={`h-full w-full border-r border-gray-200 md:w-1/3 lg:w-1/4 ${selectedRoom !== null ? "hidden md:flex" : "flex"} flex-col`}
      >
        {listType === "chat" ? (
          <ChatList rooms={rooms} onSelectRoom={onSelectedRoom} />
        ) : (
          <ContactList
            onCreateRoom={(room) => {
              onUpdateRoom(room);
              onRoomCreated(room.id);
            }}
          />
        )}
      </div>

      <div
        className={`h-full w-full md:w-2/3 lg:w-3/4 ${selectedRoom === null ? "hidden md:flex" : "flex"} flex-col`}
      >
        {selectedRoom ? (
          <ChatRoom
            chat={chat}
            messages={messages}
            onBack={() => onSelectedRoom(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Pilih chat untuk memulai
          </div>
        )}
      </div>
    </main>
  );
}
