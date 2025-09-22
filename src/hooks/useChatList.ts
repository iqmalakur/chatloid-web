import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/entities/Room";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function useChatList() {
  const { token, user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isUpdate, setIsUpdate] = useState(true);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchRooms = () => setIsUpdate(true);

  useEffect(() => {
    if (isUpdate) {
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
        } finally {
          setIsUpdate(false);
        }
      };

      fetch();
    }
  }, [token, isUpdate]);

  return { rooms, fetchRooms };
}
