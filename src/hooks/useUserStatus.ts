import { useEffect, useState } from "react";
import useSocket from "./useSocket";
import { UserStatus } from "@/entities/UserStatus";
import { Chat } from "@/entities/Chat";

export default function useUserStatus(chat: Chat | null) {
  const socket = useSocket();
  const [userStatus, setUserStatus] = useState("");

  useEffect(() => {
    if (!socket) return;

    if (userStatus === "" && chat?.userContactId) {
      socket.emit("get_user_status", { id: chat.userContactId });
    }

    socket.on("user_status", ({ userId, status }: UserStatus) => {
      if (chat?.userContactId === userId) {
        setUserStatus(status);
      }
    });

    return () => {
      socket.off("user_status");
    };
  }, [socket, chat, userStatus]);

  return { userStatus };
}
