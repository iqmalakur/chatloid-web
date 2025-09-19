import { BASE_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import {
  HiChatAlt2,
  HiOutlineChatAlt2,
  HiOutlineUserGroup,
  HiUserGroup,
} from "react-icons/hi";
import Swal from "sweetalert2";

interface SidebarProps {
  picture: string | undefined;
  name: string | undefined;
  listType: "chat" | "contact";
  onChatMenuClick: () => void;
  onContactMenuClick: () => void;
}

export default function Sidebar({
  picture,
  name,
  listType,
  onChatMenuClick,
  onContactMenuClick,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    axios
      .post(`${BASE_URL}/api/auth/logout`)
      .then(() => {
        router.push(`${BASE_URL}/login`);
      })
      .catch(() => {
        Swal.fire({
          title: "Logout Gagal",
          text: "Terjadi kesalahan saat mencoba logout. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <aside className="flex w-20 flex-col items-center border-r bg-white px-1 py-4 shadow-sm">
      <div
        className="mb-6 flex cursor-pointer flex-col items-center text-sm"
        onClick={() => {
          router.push(`${BASE_URL}/profile`);
        }}
      >
        {picture && name ? (
          <img src={picture} alt={name} className="w-12 rounded-full" />
        ) : (
          <FaUserCircle size={32} className="text-gray-500" />
        )}
      </div>

      <nav className="flex w-full flex-col gap-4">
        <button
          className={`flex cursor-pointer flex-col items-center rounded-md p-2 hover:bg-gray-100 ${
            listType === "chat" ? "font-semibold" : ""
          }`}
          onClick={onChatMenuClick}
        >
          {listType === "chat" ? (
            <HiChatAlt2 size={20} />
          ) : (
            <HiOutlineChatAlt2 size={20} />
          )}

          <span className="inline">Chat</span>
        </button>
        <button
          className={`flex cursor-pointer flex-col items-center rounded-md p-2 hover:bg-gray-100 ${
            listType === "contact" ? "font-semibold" : ""
          }`}
          onClick={onContactMenuClick}
        >
          {listType === "contact" ? (
            <HiUserGroup size={20} />
          ) : (
            <HiOutlineUserGroup size={20} />
          )}

          <span className="inline">Kontak</span>
        </button>
      </nav>

      <div className="flex-1"></div>

      <button
        className="flex cursor-pointer flex-col items-center rounded-md p-2 text-red-600 hover:bg-gray-100"
        onClick={handleLogout}
      >
        <FaSignOutAlt size={20} />
        <span className="block">Logout</span>
      </button>
    </aside>
  );
}
