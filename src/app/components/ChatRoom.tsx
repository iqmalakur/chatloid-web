export default function ChatRoom() {
  return (
    <main className="flex flex-1 flex-col bg-gray-100">
      <div className="border-b bg-white p-4 font-semibold">Header Chat</div>
      <div className="flex-1 overflow-y-auto p-4">{/* area chat */}</div>
      <div className="border-t bg-white p-4">{/* form chat */}</div>
    </main>
  );
}
