import {
  FaComments,
  FaUserFriends,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="flex w-fit flex-col items-center border-r bg-white px-1 py-4 shadow-sm">
      <div className="mb-6 flex flex-col items-center">
        <FaUserCircle size={32} className="text-gray-500" />
      </div>

      <nav className="flex w-full flex-col gap-4">
        <button className="flex flex-col items-center rounded-md p-2 hover:bg-gray-100">
          <FaComments size={20} />
          <span className="inline">Chat</span>
        </button>
        <button className="flex flex-col items-center rounded-md p-2 hover:bg-gray-100">
          <FaUserFriends size={20} />
          <span className="inline">Kontak</span>
        </button>
      </nav>

      <div className="flex-1"></div>

      <button className="flex flex-col items-center rounded-md p-2 text-red-600 hover:bg-gray-100">
        <FaSignOutAlt size={20} />
        <span className="block">Logout</span>
      </button>
    </aside>
  );
}
