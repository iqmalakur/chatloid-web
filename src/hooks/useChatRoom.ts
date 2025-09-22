import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Chat, Message } from "@/entities/Chat";
import { NewMessage } from "@/entities/NewMessage";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useChatRoom(
  id: string | null,
  updateRooms: () => void,
) {
  const { token } = useAuth();
  const { socket } = useSocket();

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const result = await axios.get<Chat>(`${API_URL}/chats/${id}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setChat(() => {
          const chat = result.data;

          chat.chats = chat.chats.map((c) => {
            return {
              ...c,
              createdAt: new Date(c.createdAt),
            };
          });

          setMessages(chat.chats);
          return chat;
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, [id, token]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: NewMessage) => {
      updateRooms();

      if (message.chatRoomId === id) {
        if (message.isEdited) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === message.id
                ? {
                    ...msg,
                    content: message.content,
                    createdAt: new Date(message.timestamp),
                    isEdited: true,
                  }
                : msg,
            ),
          );
          return;
        }

        if (message.isDeleted) {
          setMessages((prev) => {
            return prev.filter((msg) => msg.id !== message.id);
          });

          return;
        }

        const newMessage: Message = {
          id: message.id,
          sender: message.senderId,
          content: message.content,
          createdAt: new Date(message.timestamp),
          isEdited: message.isEdited,
        };
        setMessages([...messages, newMessage]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket, messages, id, updateRooms]);

  return { chat, messages };
}
