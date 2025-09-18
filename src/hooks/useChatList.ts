import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/entities/Room";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useChatList() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

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

  return { rooms };
}
