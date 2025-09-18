import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/config";

type SocketContextType = { socket: Socket | null };
const SocketContext = createContext<SocketContextType>({ socket: null });

export function SocketProvider({ children }: PropsWithChildren) {
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

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}
