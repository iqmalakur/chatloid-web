export function formatChatListDate(date?: Date): string {
  if (!date) return "";

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (target.getTime() === yesterday.getTime()) {
    return "Kemarin";
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}
