import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { formatSimpleDate } from "@/helper/date";
import useContactRequests from "@/hooks/useContactRequests";
import axios from "axios";
import Swal from "sweetalert2";

export function ContactRequestList() {
  const { token } = useAuth();
  const { contactRequests, refresh } = useContactRequests();

  const handleContactRequest = async (id: string, accepted: boolean) => {
    try {
      if (!accepted) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to reject this contact request?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, reject",
        });

        if (!result.isConfirmed) return;
      }

      await axios.patch(
        `${API_URL}/contact-requests/${id}`,
        { accepted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refresh();

      Swal.fire({
        icon: "success",
        title: `Contact ${accepted ? "accepted" : "rejected"}`,
        text: `The contact request has been ${accepted ? "accepted successfully" : "rejected"}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update contact request.",
      });
      console.error("Contact request error:", error);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="mb-4 text-lg font-semibold">Contact requests</h2>
      {contactRequests.length === 0 && (
        <p className="text-gray-500">No contact requests</p>
      )}
      <ul className="flex flex-col gap-2">
        {contactRequests.map((request) => (
          <li
            key={request.id}
            className="flex items-center justify-between rounded-md p-3 shadow-sm"
          >
            <div>
              <p className="font-medium">{request.name}</p>
              <p className="text-sm text-gray-500">@{request.username}</p>
              <p className="text-xs text-gray-400">
                {formatSimpleDate(request.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              {request.isAccepted ? (
                <span className="text-sm text-green-600">Contact accepted</span>
              ) : (
                <>
                  <button
                    onClick={() => handleContactRequest(request.id, true)}
                    className="cursor-pointer rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleContactRequest(request.id, false)}
                    className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
