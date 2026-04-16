"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const fullBleedRoutes = ["/auth/login", "/unauthorized"];

export default function AppShell({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isFullBleed = fullBleedRoutes.includes(pathname);

  // Public/full-bleed pages render without shell
  if (isFullBleed) {
    return <main className="min-h-screen">{children}</main>;
  }

  // While loading session, avoid flashing the shell without data
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="h-2 w-2 animate-ping rounded-full bg-brand-600" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <Sidebar
        role={session.user?.role}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
