import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/entities/User";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { token, user: authUser } = useAuth();

  const [user, setUser] = useState(authUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    picture: "",
    pictureFile: null as File | null,
  });
  const containerRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name,
        username: authUser.username,
        picture: authUser.picture,
        pictureFile: null,
      });
    }
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        pictureFile: file,
        picture: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const payload: any = {};

      if (formData.name !== user.name) {
        payload.name = formData.name;
      }
      if (formData.username !== user.username) {
        payload.username = formData.username;
      }
      // if (formData.pictureFile) {
      //   const formDataUpload = new FormData();
      //   formDataUpload.append("picture", formData.pictureFile);
      //   // misalnya kalau upload terpisah ke endpoint lain
      // }

      if (Object.keys(payload).length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "You didn’t change anything to update.",
          confirmButtonColor: "#3b82f6",
        });
        setIsEditing(false);
        return;
      }

      const result = await axios.patch<User>(`${API_URL}/users/me`, payload, {
        headers: { Authorization: `bearer ${token}` },
      });

      setUser(result.data);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error: any) {
      console.error("Update failed:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating your profile.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    if (!user) return;
    setFormData({
      name: user.name,
      username: user.username,
      picture: user.picture,
      pictureFile: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.8)]"
      ref={containerRef}
      onClick={(evt) => {
        if (evt.target == containerRef.current) onClose();
      }}
    >
      {!user ? (
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
      ) : (
        <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <HiX size={22} />
          </button>

          <div className="flex justify-center">
            <img
              src={isEditing ? formData.picture : user.picture}
              alt={user.name}
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-200 object-cover shadow-sm"
            />
          </div>

          <div className="mt-6 text-center">
            {isEditing ? (
              <div className="space-y-3">
                <div className="text-left">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload New Picture
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <label className="mb-2 block text-left text-sm font-medium text-gray-700">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="my-2 w-full rounded-md border p-2 text-sm"
                  />
                </label>

                <label className="mb-2 block text-left text-sm font-medium text-gray-700">
                  Username
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="my-2 w-full rounded-md border p-2 text-sm"
                  />
                </label>

                <p className="text-sm text-gray-500">{user.email}</p>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleSave}
                    className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-500">@{user.username}</p>
                <p className="mt-2 text-sm text-gray-600">{user.email}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
