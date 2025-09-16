"use client";

import { API_URL, BASE_URL } from "@/config";
import { User } from "@/entities/User";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = { token: string; user: User | null };
type AuthProviderProps = PropsWithChildren & { token: string | undefined };

const AuthContext = createContext<AuthContextType>({
  token: "",
  user: null,
});

export function AuthProvider({ token, children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!token) {
    if (!pathname.startsWith("/login")) {
      router.push(`${BASE_URL}/login`);
    }
    return children;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await axios.get<User>(`${API_URL}/users/me`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setUser(result.data);
    };

    fetch();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
