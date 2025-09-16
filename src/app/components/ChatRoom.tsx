"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi";

interface Message {
  id: number;
  sender: "me" | "friend";
  content: string;
  timestamp: Date;
}

interface ChatProps {
  friend: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  };
  initialMessages: Message[];
}

export default function ChatRoom({ friend, initialMessages }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

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
    const prevDate = messages[index - 1].timestamp;
    const currDate = messages[index].timestamp;
    return prevDate.toDateString() !== currDate.toDateString();
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 p-3">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold">{friend.name}</h2>
          <p className="text-sm text-gray-500">
            {friend.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            {shouldShowSeparator(messages, i) && (
              <div className="mb-2 text-center text-xs text-gray-500">
                {formatDateSeparator(msg.timestamp)}
              </div>
            )}
            <div
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 text-sm shadow ${
                  msg.sender === "me"
                    ? "rounded-br-none bg-blue-500 text-white"
                    : "rounded-bl-none bg-white text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <span className="mt-1 block text-right text-xs text-gray-300">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
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
