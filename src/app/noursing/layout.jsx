"use client";

import Alert from "@/components/Alert";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }) {
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const isAppointments = pathname === "/noursing";

  const handleNavigation = (target) => {
    router.push(target);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Enfermería</h2>
          <p className="page-subtitle">
            Registra signos vitales para consultas y servicios médicos.
          </p>
        </div>
      </div>

      {error && (
        <Alert
          message={`Error: ${error}`}
          color="danger"
          setStatus={() => setError(null)}
        />
      )}

      <div className="surface-card mb-6 p-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => handleNavigation("/noursing")}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isAppointments
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-muted hover:bg-slate-50"
            }`}
          >
            Consultas por atender
          </button>
          <button
            type="button"
            onClick={() => handleNavigation("/noursing/services")}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              !isAppointments
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-muted hover:bg-slate-50"
            }`}
          >
            Servicios por atender
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
