import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { HeroUIProvider } from "@heroui/react";
import AuthProvider from "@/components/AuthProvider";
import AppShell from "@/components/AppShell";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Mundo Kids · Clínica pediátrica",
  description:
    "Sistema de gestión clínica para la clínica pediátrica Mundo Kids: pacientes, consultas, historial, enfermería y reportes.",
};

export const viewport = {
  themeColor: "#0E7490",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${plusJakarta.variable} bg-surface-muted`}>
      <body className="min-h-screen bg-surface-muted font-sans text-ink antialiased">
        <AuthProvider>
          <HeroUIProvider>
            <AppShell>{children}</AppShell>
          </HeroUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
