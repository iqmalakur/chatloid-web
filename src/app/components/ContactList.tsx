import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/entities/Room";
import useContactList from "@/hooks/useContactList";
import axios from "axios";
import Swal from "sweetalert2";
import { HiPlus } from "react-icons/hi";

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
        { contactId: id },
        { headers: { Authorization: `bearer ${token}` } },
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

  const handleAddContact = async () => {
    const { value: username } = await Swal.fire<string>({
      title: "Add Contact",
      input: "text",
      inputLabel: "Enter Username",
      inputPlaceholder: "e.g. johndoe123",
      showCancelButton: true,
      confirmButtonText: "Send Request",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Username cannot be empty!";
        }
        return null;
      },
    });

    if (username) {
      try {
        await axios.post(
          `${API_URL}/contacts`,
          { username },
          { headers: { Authorization: `bearer ${token}` } },
        );

        Swal.fire({
          title: "Request Sent!",
          text: `Contact request to ${username} has been sent successfully.`,
          icon: "success",
        });
      } catch (e: any) {
        console.error(e);
        Swal.fire({
          title: "Failed to Add Contact",
          text: e.response?.data?.message || "Username not found",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="relative h-full w-full border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Contacts ({contacts?.total})</h2>
      </div>
      <div className="overflow-y-auto">
        {contacts?.contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
            onClick={() => handleCreateRoom(contact.id)}
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

      <button
        onClick={handleAddContact}
        className="absolute right-6 bottom-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
      >
        <HiPlus className="text-2xl" />
      </button>
    </div>
  );
}
