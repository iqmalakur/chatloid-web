import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { ContactResponse } from "@/entities/ContactResponse";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ContactList() {
  const { token } = useAuth();

  const [data, setData] = useState<ContactResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get<ContactResponse>(`${API_URL}/contacts`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setData(result.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  return (
    <div className="h-full w-full border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Contacts ({data?.total})</h2>
      </div>
      <div className="overflow-y-auto">
        {data?.contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
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
