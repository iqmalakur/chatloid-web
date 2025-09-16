import { BASE_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaComments,
  FaUserFriends,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface SidebarProps {
  picture: string | undefined;
  name: string | undefined;
  onChatMenuClick: () => void;
  onContactMenuClick: () => void;
}

export default function Sidebar({
  picture,
  name,
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
    <aside className="flex w-fit flex-col items-center border-r bg-white px-1 py-4 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-sm">
        {picture && name ? (
          <img src={picture} alt={name} className="w-10 rounded-full" />
        ) : (
          <FaUserCircle size={32} className="text-gray-500" />
        )}
      </div>

      <nav className="flex w-full flex-col gap-4">
        <button
          className="flex flex-col items-center rounded-md p-2 hover:bg-gray-100"
          onClick={onChatMenuClick}
        >
          <FaComments size={20} />
          <span className="inline">Chat</span>
        </button>
        <button
          className="flex flex-col items-center rounded-md p-2 hover:bg-gray-100"
          onClick={onContactMenuClick}
        >
          <FaUserFriends size={20} />
          <span className="inline">Kontak</span>
        </button>
      </nav>

      <div className="flex-1"></div>

      <button
        className="flex flex-col items-center rounded-md p-2 text-red-600 hover:bg-gray-100"
        onClick={handleLogout}
      >
        <FaSignOutAlt size={20} />
        <span className="block">Logout</span>
      </button>
    </aside>
  );
}
