import { useSocket } from "@/context/SocketContext";
import { Message } from "@/entities/Chat";
import { formatTime } from "@/helper/date";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRef, useState } from "react";
import { HiChevronDown, HiChevronUp, HiXMark, HiCheck } from "react-icons/hi2";

interface MessageItemProps {
  message: Message;
  userId?: string;
}

export default function MessageItem({ message, userId }: MessageItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const optionsRef = useRef(null);
  const { socket } = useSocket();

  useClickOutside(optionsRef, showOptions, () => setShowOptions(false));

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    socket?.emit("edit_message", {
      id: message.id,
      content: editContent.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${
        message.sender === userId ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`group relative max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow md:max-w-[85%] lg:max-w-[70%] ${
          message.sender === userId
            ? "rounded-br-none bg-blue-500 text-white"
            : "rounded-bl-none bg-white text-gray-800"
        }`}
      >
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 rounded-md px-2 py-1 text-sm text-white focus:outline-none"
              autoFocus
            />
            <button
              className="rounded-md bg-red-400 p-1 text-black hover:bg-red-500"
              onClick={() => setIsEditing(false)}
            >
              <HiXMark className="text-lg" />
            </button>
            <button
              className="rounded-md bg-emerald-400 p-1 text-black hover:bg-emerald-500"
              onClick={handleSaveEdit}
            >
              <HiCheck className="text-lg" />
            </button>
          </div>
        ) : (
          <>
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
            <span className="mt-1 block text-right text-xs text-gray-300">
              {formatTime(message.createdAt)}
            </span>
          </>
        )}

        {message.sender === userId && !isEditing && (
          <>
            <button
              className="absolute top-1 right-1 hidden cursor-pointer rounded-sm bg-[linear-gradient(to_left_bottom,rgba(0,0,0,.6),rgba(0,0,0,.3))] p-0.5 group-hover:block"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              {showOptions ? (
                <HiChevronUp className="text-xl font-semibold text-slate-200" />
              ) : (
                <HiChevronDown className="text-xl font-semibold text-slate-200" />
              )}
            </button>

            {showOptions && (
              <div
                className="absolute top-7 right-1 z-10 w-28 rounded-md bg-white py-1 text-sm shadow-lg"
                ref={optionsRef}
              >
                <button
                  className="block w-full px-3 py-1 text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowOptions(false);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full px-3 py-1 text-left text-red-500 hover:bg-red-100"
                  onClick={() => {
                    setShowOptions(false);
                    socket?.emit("delete_message", { id: message.id });
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
