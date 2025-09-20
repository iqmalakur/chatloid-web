"use client";

import { useAuth } from "@/context/AuthContext";
import { Chat, Message } from "@/entities/Chat";
import { capitalize } from "@/helper/capitalize";
import { useSocket } from "@/context/SocketContext";
import useUserStatus from "@/hooks/useUserStatus";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { formatDateSeparator, formatTime } from "@/helper/date";
import { HiArrowLeft } from "react-icons/hi";

interface ChatRoomProps {
  chat: Chat | null;
  messages: Message[];
  onBack: () => void;
}

export default function ChatRoom({ chat, messages, onBack }: ChatRoomProps) {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [input, setInput] = useState("");

  const { userStatus } = useUserStatus(chat);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const shouldShowSeparator = (messages: Message[], index: number) => {
    if (index === 0) return true;
    const prevDate = messages[index - 1].createdAt;
    const currDate = messages[index].createdAt;
    return prevDate.toDateString() !== currDate.toDateString();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socket) return;
    if (!chat) return;

    socket.emit("send_message", {
      chatRoomId: chat.id,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 p-3">
        <button
          className="text-xl text-black hover:text-gray-600 md:hidden"
          onClick={() => onBack()}
        >
          <HiArrowLeft />
        </button>

        <img
          src={chat?.picture}
          alt={chat?.displayName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold">{chat?.displayName}</h2>
          <p className="text-sm text-gray-500">{capitalize(userStatus)}</p>
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
          placeholder="Write a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full border px-3 py-2 outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="cursor-pointer rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}
