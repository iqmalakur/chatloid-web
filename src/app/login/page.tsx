"use client";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    alert("Login dengan Google");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f0ebeb]">
      <div className="flex w-[90%] flex-col items-center gap-6 rounded-xl bg-white p-8 shadow-lg md:w-[450px]">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-700">ChatLoid</h1>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Masuk ke aplikasi</h2>
          <p className="mt-2 text-sm text-gray-500">
            Gunakan akun Google untuk masuk dan mulai chatting
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-600 shadow-sm transition hover:bg-gray-100"
        >
          <FcGoogle size={22} />
          Login dengan Google
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Dengan login, Anda menyetujui{" "}
          <span className="text-blue-500">Ketentuan</span> dan{" "}
          <span className="text-blue-500">Kebijakan Privasi</span>.
        </p>
      </div>
    </div>
  );
}
