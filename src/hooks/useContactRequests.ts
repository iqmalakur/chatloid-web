import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { ContactRequest } from "@/entities/ContactRequest";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useContactRequests() {
  const { token } = useAuth();

  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [update, setUpdate] = useState(true);

  const refresh = () => setUpdate(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get<ContactRequest[]>(
          `${API_URL}/contact-requests`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          },
        );
        setContactRequests(() => {
          const contactRequests = result.data.map((request) => ({
            ...request,
            createdAt: new Date(request.createdAt),
          }));
          return contactRequests;
        });
      } catch (e) {
        console.error(e);
      } finally {
        setUpdate(false);
      }
    };

    fetch();
  }, [update, token]);

  return { contactRequests, refresh };
}
