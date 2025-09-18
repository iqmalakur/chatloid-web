import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Chat, Message } from "@/entities/Chat";
import { NewMessage } from "@/entities/NewMessage";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useChatRoom(
  id: string | null,
  onMessageUpdate: (message: NewMessage) => void,
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
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: NewMessage) => {
      if (message.chatRoomId === id) {
        const newMessage: Message = {
          id: message.id,
          sender: message.senderId,
          content: message.content,
          createdAt: new Date(message.timestamp),
          isEdited: message.isEdited,
        };
        setMessages([...messages, newMessage]);
      }

      onMessageUpdate(message);
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket, messages]);

  return { chat, messages };
}
