import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Room {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
}

const dummyRooms: Room[] = [
  {
    id: 1,
    name: "Alice",
    lastMessage: "Hey, how are you?",
    time: "10:15",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Bob",
    lastMessage: "Let’s meet tomorrow!",
    time: "09:45",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Charlie",
    lastMessage: "Okay, see you later.",
    time: "Yesterday",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

interface ChatListProps {
  onSelectRoom: (roomId: number) => void;
}

export default function ChatList({ onSelectRoom }: ChatListProps) {
  const [search, setSearch] = useState("");

  const filteredRooms = dummyRooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="flex h-full w-full flex-col border-r border-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-200 p-3">
        <FaSearch className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari pesan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="flex cursor-pointer items-center p-3 hover:bg-gray-100"
            onClick={() => onSelectRoom(room.id)}
          >
            <img
              src={room.avatar}
              alt={room.name}
              className="mr-3 h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{room.name}</h3>
                <span className="text-xs text-gray-400">{room.time}</span>
              </div>
              <p className="truncate text-sm text-gray-500">
                {room.lastMessage}
              </p>
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="mt-5 text-center text-gray-400">
            Tidak ada chat ditemukan
          </div>
        )}
      </div>
    </section>
  );
}
