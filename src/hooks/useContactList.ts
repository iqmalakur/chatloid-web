import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { ContactResponse } from "@/entities/ContactResponse";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useContactList() {
  const { token } = useAuth();

  const [contacts, setContacts] = useState<ContactResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get<ContactResponse>(`${API_URL}/contacts`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setContacts(result.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  return { contacts };
}
