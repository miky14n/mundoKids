import "./globals.css";
import Navbar from "../components/NavBAr";
import { NextUIProvider } from "@nextui-org/react";
import NavBarNxtUI from "@/components/NavBarNxtUI";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import AuthProvider from "@/components/AuthProvider";
export const metadata = {
  title: "Clinaca mundo KIDS",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 min-h-screen font-sans">
        <NextUIProvider>
          <div>
            <NavBarNxtUI />
            <AuthProvider>{children}</AuthProvider>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
