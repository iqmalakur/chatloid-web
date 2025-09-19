import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { NewMessage } from "@/entities/NewMessage";
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

  const onUpdateRoom = (room: Room) => {
    setRooms((rooms) => {
      if (!rooms.find((r) => r.id === room.id)) {
        return [...rooms, room];
      }
      return rooms;
    });
  };

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
      } else {
        if (
          userRef.current != null &&
          message.receiverId === userRef.current.id
        ) {
          setIsUpdate(true);
        }
      }

      return Array.from(roomsMap.values()).sort(
        (a, b) =>
          (b.lastMessage?.createdAt.getTime() ?? 0) -
          (a.lastMessage?.createdAt.getTime() ?? 0),
      );
    });
  };

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
  }, [isUpdate]);

  return { rooms, onMessageUpdate, onUpdateRoom };
}
