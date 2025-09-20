import { BASE_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaBars, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import {
  HiBell,
  HiChatAlt2,
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineUserGroup,
  HiUserGroup,
} from "react-icons/hi";
import Swal from "sweetalert2";
import UserProfile from "./UserProfile";
import { ListType } from "@/types/ListType";
import MenuButton from "./MenuButton";

interface SidebarProps {
  picture: string | undefined;
  name: string | undefined;
  listType: ListType;
  onChatMenuClick: () => void;
  onContactMenuClick: () => void;
  onNotificationMenuClick: () => void;
}

export default function Sidebar({
  picture,
  name,
  listType,
  onChatMenuClick,
  onContactMenuClick,
  onNotificationMenuClick,
}: SidebarProps) {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from this account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${BASE_URL}/api/auth/logout`)
          .then(() => {
            Swal.fire(
              "Logged Out!",
              "You have been successfully logged out.",
              "success",
            );
            router.push(`${BASE_URL}/login`);
          })
          .catch(() => {
            Swal.fire({
              title: "Logout Failed",
              text: "An error occurred while trying to log out. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  return (
    <div className="relative w-12">
      <div
        className={`absolute top-0 bottom-0 left-0 z-40 ${isExpanded ? "w-screen" : "w-0"}`}
        onClick={() => setIsExpanded(false)}
      ></div>
      <div
        className={`absolute top-0 bottom-0 left-0 z-50 overflow-x-hidden border-r bg-white shadow-sm transition-all duration-100 ${isExpanded ? "w-40" : "w-12"}`}
      >
        <aside className="flex h-full w-fit flex-col items-start bg-white px-1 py-4">
          <div
            className="mb-6 flex cursor-pointer items-center gap-3.5 p-1 font-semibold"
            onClick={() => setShowProfile(true)}
          >
            {picture && name ? (
              <img src={picture} alt={name} className="w-8 rounded-full" />
            ) : (
              <FaUserCircle size={32} className="text-gray-500" />
            )}
            <span className="inline">Profile</span>
          </div>

          <nav className="flex w-full flex-col gap-4">
            <MenuButton
              active={false}
              onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
              activeIcon={<></>}
              inactiveIcon={<FaBars size={20} />}
              label="Menu"
            />
            <MenuButton
              active={listType === "chat"}
              onClick={onChatMenuClick}
              activeIcon={<HiChatAlt2 size={20} />}
              inactiveIcon={<HiOutlineChatAlt2 size={20} />}
              label="Chat"
            />
            <MenuButton
              active={listType === "contact"}
              onClick={onContactMenuClick}
              activeIcon={<HiUserGroup size={20} />}
              inactiveIcon={<HiOutlineUserGroup size={20} />}
              label="Contact"
            />
            <MenuButton
              active={listType === "notification"}
              onClick={onNotificationMenuClick}
              activeIcon={<HiBell size={20} />}
              inactiveIcon={<HiOutlineBell size={20} />}
              label="Notification"
            />
          </nav>

          <div className="flex-1"></div>

          <button
            className="ml-0.5 flex cursor-pointer items-center gap-3.5 rounded-md p-2 text-red-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            <span className="block">Logout</span>
          </button>

          <UserProfile
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
          />
        </aside>
      </div>
    </div>
  );
}
