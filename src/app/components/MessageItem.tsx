import { Message } from "@/entities/Chat";
import { formatTime } from "@/helper/date";

interface MessageItemProps {
  message: Message;
  userId?: string;
}

export default function MessageItem({ message, userId }: MessageItemProps) {
  return (
    <div
      className={`flex ${
        message.sender === userId ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow md:max-w-[85%] lg:max-w-[70%] ${
          message.sender === userId
            ? "rounded-br-none bg-blue-500 text-white"
            : "rounded-bl-none bg-white text-gray-800"
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
        <span className="mt-1 block text-right text-xs text-gray-300">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
