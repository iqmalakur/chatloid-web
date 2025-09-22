import useChatList from "@/hooks/useChatList";
import useChatRoom from "@/hooks/useChatRoom";
import ChatList from "./ChatList";
import ContactList from "./ContactList";
import ChatRoom from "./ChatRoom";
import { ListType } from "@/types/ListType";
import { ContactRequestList } from "./ContactRequestList";

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
  const { rooms, fetchRooms } = useChatList();
  const { chat, messages } = useChatRoom(selectedRoom, fetchRooms);

  return (
    <main className="flex h-screen min-w-0 flex-1">
      <div
        className={`h-full w-full border-r border-gray-200 md:w-1/3 lg:w-1/4 ${selectedRoom !== null ? "hidden md:flex" : "flex"} flex-col`}
      >
        {listType === "chat" && (
          <ChatList rooms={rooms} onSelectRoom={onSelectedRoom} />
        )}
        {listType === "contact" && (
          <ContactList
            onCreateRoom={(room) => {
              fetchRooms();
              onRoomCreated(room.id);
            }}
          />
        )}
        {listType === "notification" && <ContactRequestList />}
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
            Select chat to begin
          </div>
        )}
      </div>
    </main>
  );
}
