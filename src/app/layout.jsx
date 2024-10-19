import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/NavBAr";
import { NextUIProvider } from "@nextui-org/react";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <div className="font-sans">
            <Navbar />
            {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
