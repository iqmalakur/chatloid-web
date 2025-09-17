import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(API_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketInstance.on("error", (message) => {
      console.error(message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("error");
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
