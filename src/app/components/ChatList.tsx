import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/entities/Room";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface ChatListProps {
  onSelectRoom: (roomId: string) => void;
}

export default function ChatList({ onSelectRoom }: ChatListProps) {
  const { token } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get<Room[]>(`${API_URL}/chats`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setRooms(
          result.data.map((room) => {
            if (room.lastMessage)
              return {
                ...room,
                lastMessage: {
                  content: room.lastMessage.content,
                  createdAt: new Date(room.lastMessage.createdAt),
                },
              };
            return room;
          }),
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

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
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex cursor-pointer items-center p-3 hover:bg-gray-100"
            onClick={() => onSelectRoom(room.id)}
          >
            <img
              src={room.picture}
              alt={room.displayName}
              className="mr-3 h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{room.displayName}</h3>
                <span className="text-xs text-gray-400">
                  {room.lastMessage?.createdAt.toDateString() ?? ""}
                </span>
              </div>
              <p className="truncate text-sm text-gray-500">
                {room.lastMessage?.content || ""}
              </p>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="mt-5 text-center text-gray-400">
            Tidak ada chat ditemukan
          </div>
        )}
      </div>
    </section>
  );
}
