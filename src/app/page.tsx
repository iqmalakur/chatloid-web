import { cookies } from "next/headers";
import ChatLayout from "./components/ChatLayout";
import axios from "axios";
import { API_URL } from "@/config";
import { redirect } from "next/navigation";
import User from "@/entities/User";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return redirect("/login");
  }

  try {
    const response = await axios.get<User>(`${API_URL}/users/me`, {
      headers: {
        Authorization: `bearer ${token.value}`,
      },
    });

    return <ChatLayout user={response.data} />;
  } catch (e) {
    return redirect("/login");
  }
}
