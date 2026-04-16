"use client";

import { usePathname } from "next/navigation";
import ToggleAvatar from "../ToggleAvatar";

const pageTitles = {
  "/": { title: "Panel principal", subtitle: "Resumen y accesos rápidos de la clínica" },
  "/register": { title: "Registrar paciente", subtitle: "Alta de un nuevo paciente pediátrico" },
  "/medical-appointment": { title: "Agendar consulta", subtitle: "Crear una nueva cita médica" },
  "/medical-history": { title: "Historial clínico", subtitle: "Busca y revisa el historial de los pacientes" },
  "/medical-services": { title: "Registrar servicio", subtitle: "Servicios médicos externos a consulta" },
  "/medical-services/listOfServices": { title: "Lista de servicios", subtitle: "Catálogo de especialidades y servicios" },
  "/noursing": { title: "Enfermería", subtitle: "Signos vitales y atención previa" },
  "/noursing/services": { title: "Enfermería · Servicios", subtitle: "Signos vitales para servicios médicos" },
  "/contributions": { title: "Aportes", subtitle: "Registro de aportes médicos" },
  "/administration": { title: "Reportes", subtitle: "Indicadores y exportación de datos" },
  "/administration/manage": { title: "Gestión clínica", subtitle: "Doctores, especialidades y servicios" },
  "/administration/manage/users-list": { title: "Usuarios", subtitle: "Administra las cuentas del personal" },
  "/auth/register": { title: "Registrar usuario", subtitle: "Crea cuentas para el personal clínico" },
  "/auth/changePassword": { title: "Cambiar contraseña", subtitle: "Actualiza tu contraseña de acceso" },
};

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const roleLabels = {
  admin: "Administración",
  it: "TI",
  nurse: "Enfermería",
  doctor: "Doctor",
  receptionist: "Recepción",
  partner: "Socio",
};

export default function Topbar({ session, onOpenMenu }) {
  const pathname = usePathname();
  const match =
    pageTitles[pathname] ||
    (pathname.startsWith("/medical-history/")
      ? { title: "Detalle del paciente", subtitle: "Información médica completa" }
      : { title: "Mundo Kids", subtitle: "Sistema clínico" });

  const role = session?.user?.role;
  const userName = session?.user?.name || session?.user?.email;

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-muted hover:bg-slate-50 lg:hidden"
        aria-label="Abrir menú"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-ink sm:text-xl">
            {match.title}
          </h1>
          {role && (
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100 sm:inline-flex">
              {roleLabels[role] || role}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-ink-soft sm:text-sm">
          {match.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-ink">{userName}</p>
          <p className="text-[11px] text-ink-faint">
            {roleLabels[role] || role}
          </p>
        </div>
        <ToggleAvatar name={session?.user?.name} role={role} />
      </div>
    </header>
  );
}
