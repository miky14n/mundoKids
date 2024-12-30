import "./globals.css";
import Navbar from "../components/NavBAr";
import { NextUIProvider } from "@nextui-org/react";
import NavBarNxtUI from "@/components/NavBarNxtUI";

export const metadata = {
  title: "Clinaca mundo KIDS",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <NextUIProvider>
          <div className="font-sans">
            <NavBarNxtUI />
            {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
