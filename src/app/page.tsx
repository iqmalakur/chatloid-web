import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar />
      <ChatList />
      <ChatRoom />
    </div>
  );
}
