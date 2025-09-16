import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";

const interSans = Inter({ subsets: ["latin"], fallback: ["sans-serif"] });

export const metadata: Metadata = {
  title: "ChatLoid",
  description: "Real-time chat app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  return (
    <html lang="en">
      <body className={`${interSans.className} bg-white`}>
        <AuthProvider token={token?.value}>{children}</AuthProvider>
      </body>
    </html>
  );
}
