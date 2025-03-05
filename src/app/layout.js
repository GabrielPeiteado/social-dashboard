import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Social Dashboard | Analyze & Manage Social Media Metrics",
  description: "A powerful dashboard to track, analyze, and manage social media performance across multiple platforms in real time.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 min-h-screen text-white">
        <Navbar />
        <Toaster toastOptions={{ duration: 2000 }} />
        <main className="w-full pt-16">{children}</main>
      </body>
    </html>
  );
}
