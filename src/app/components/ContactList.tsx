import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/entities/Room";
import useContactList from "@/hooks/useContactList";
import axios from "axios";
import Swal from "sweetalert2";

interface ContactListProps {
  onCreateRoom: (room: Room) => void;
}

export default function ContactList({ onCreateRoom }: ContactListProps) {
  const { token } = useAuth();
  const { contacts } = useContactList();

  const handleCreateRoom = async (id: string) => {
    try {
      const result = await axios.post<Room>(
        `${API_URL}/chats`,
        {
          contactId: id,
        },
        {
          headers: { Authorization: `bearer ${token}` },
        },
      );

      onCreateRoom(result.data);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Failed to create chat room!",
        icon: "error",
      });
    }
  };

  return (
    <div className="h-full w-full border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Contacts ({contacts?.total})</h2>
      </div>
      <div className="overflow-y-auto">
        {contacts?.contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              handleCreateRoom(contact.id);
            }}
          >
            <img
              src={contact.picture}
              alt={contact.name}
              className="mr-3 h-12 w-12 rounded-full object-cover"
            />
            <h3 className="font-semibold">{contact.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
