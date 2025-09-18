"use client";

import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Chat, Message } from "@/entities/Chat";
import { NewMessage } from "@/entities/NewMessage";
import { capitalize } from "@/helper/capitalize";
import useSocket from "@/hooks/useSocket";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

interface ChatRoomProps {
  id: string;
}

export default function ChatRoom({ id }: ChatRoomProps) {
  const { user, token } = useAuth();
  const socket = useSocket();

  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  useEffect(() => {
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
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket, messages]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDateSeparator = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hari ini";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID");
    }
  };

  const shouldShowSeparator = (messages: Message[], index: number) => {
    if (index === 0) return true;
    const prevDate = messages[index - 1].createdAt;
    const currDate = messages[index].createdAt;
    return prevDate.toDateString() !== currDate.toDateString();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socket) return;

    socket.emit("send_message", {
      chatRoomId: id,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 p-3">
        <img
          src={chat?.picture}
          alt={chat?.displayName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold">{chat?.displayName}</h2>
          <p className="text-sm text-gray-500">
            {capitalize(chat?.status ?? "")}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            {shouldShowSeparator(messages, i) && (
              <div className="mb-2 text-center text-xs text-gray-500">
                {formatDateSeparator(msg.createdAt)}
              </div>
            )}
            <div
              className={`flex ${
                msg.sender === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 text-sm shadow ${
                  msg.sender === user?.id
                    ? "rounded-br-none bg-blue-500 text-white"
                    : "rounded-bl-none bg-white text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <span className="mt-1 block text-right text-xs text-gray-300">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          type="text"
          placeholder="Tulis pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full border px-3 py-2 outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}
