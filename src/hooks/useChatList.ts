import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { NewMessage } from "@/entities/NewMessage";
import { Room } from "@/entities/Room";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useChatList() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  const onMessageUpdate = (message: NewMessage) => {
    setRooms((rooms) => {
      const roomsMap = new Map(rooms.map((room) => [room.id, room]));
      const room = roomsMap.get(message.chatRoomId);

      if (room) {
        roomsMap.set(room.id, {
          ...room,
          lastMessage: {
            content: message.content,
            createdAt: new Date(message.timestamp),
          },
        });
      }

      return Array.from(roomsMap.values()).sort(
        (a, b) =>
          (b.lastMessage?.createdAt.getTime() ?? 0) -
          (a.lastMessage?.createdAt.getTime() ?? 0),
      );
    });
  };

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

  return { rooms, onMessageUpdate };
}
