"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}
function IconUserPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}
function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}
function IconStethoscope(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2v6a4 4 0 0 0 8 0V2" />
      <path d="M10 14v3a4 4 0 0 0 8 0v-1" />
      <circle cx="18" cy="11" r="2" />
    </svg>
  );
}
function IconClipboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4h6v3H9z" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}
function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
function IconSyringe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m18 2 4 4M15 5l4 4M11 9l5 5M5 22l-3-3 10-10 3 3zM9 13l2 2" />
    </svg>
  );
}
function IconList(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </svg>
  );
}
function IconCoin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2.2 0 2.8 6 1.5 6 4.3 0 1.3-1.3 2.5-3 2.5a3.3 3.3 0 0 1-3-1.8M12 7v10" />
    </svg>
  );
}
function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a7.97 7.97 0 0 0 .1-6l1.7-1.3-2-3.4-2 .8a7.97 7.97 0 0 0-5.2-3L12 0h-4l-.3 2a8 8 0 0 0-5.2 3L.5 4.3l-2 3.4 1.7 1.3a8 8 0 0 0 0 6L-1.5 16.3l2 3.4 2-.8a8 8 0 0 0 5.2 3L8 24h4l.3-2a8 8 0 0 0 5.2-3l2 .8 2-3.4z" />
    </svg>
  );
}
function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <circle cx="17" cy="7" r="3" />
      <path d="M22 20a5 5 0 0 0-5-5" />
    </svg>
  );
}

const navSections = [
  {
    label: "General",
    items: [
      { href: "/", label: "Inicio", icon: IconHome, roles: ["all"] },
    ],
  },
  {
    label: "Pacientes",
    items: [
      { href: "/register", label: "Registrar paciente", icon: IconUserPlus, roles: ["admin", "it", "nurse", "receptionist"] },
      { href: "/medical-history", label: "Historial clínico", icon: IconClipboard, roles: ["all"] },
    ],
  },
  {
    label: "Atención",
    items: [
      { href: "/medical-appointment", label: "Agendar consulta", icon: IconCalendar, roles: ["admin", "it", "nurse", "receptionist"] },
      { href: "/noursing", label: "Enfermería", icon: IconStethoscope, roles: ["admin", "it", "nurse", "receptionist"] },
    ],
  },
  {
    label: "Servicios",
    items: [
      { href: "/medical-services", label: "Registrar servicio", icon: IconSyringe, roles: ["admin", "it", "nurse", "receptionist"] },
      { href: "/medical-services/listOfServices", label: "Lista de servicios", icon: IconList, roles: ["all"] },
    ],
  },
  {
    label: "Gestión",
    items: [
      { href: "/administration", label: "Reportes", icon: IconChart, roles: ["admin", "it", "nurse", "receptionist"] },
      { href: "/contributions", label: "Aportes", icon: IconCoin, roles: ["admin", "it", "nurse", "receptionist"] },
      { href: "/administration/manage", label: "Gestión clínica", icon: IconSettings, roles: ["admin", "it"] },
      { href: "/administration/manage/users-list", label: "Usuarios", icon: IconUsers, roles: ["admin", "it"] },
    ],
  },
];

function canSee(itemRoles, role) {
  if (!role) return false;
  if (itemRoles.includes("all")) return true;
  return itemRoles.includes(role);
}

export default function Sidebar({ role, open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-100">
              <Image
                src="/Logo.png"
                alt="Mundo Kids"
                width={40}
                height={40}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Mundo Kids</p>
              <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                Clínica pediátrica
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => {
            const visible = section.items.filter((i) => canSee(i.roles, role));
            if (visible.length === 0) return null;
            return (
              <div key={section.label} className="mb-4">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  {section.label}
                </p>
                <ul className="space-y-1">
                  {visible.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            active
                              ? "bg-brand-50 text-brand-700"
                              : "text-ink-muted hover:bg-slate-50 hover:text-ink"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              active
                                ? "bg-brand-100 text-brand-700"
                                : "bg-slate-100 text-ink-soft group-hover:bg-slate-200"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4">
            <p className="text-xs font-semibold text-brand-800">
              Cuidamos a tu familia
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
              Atención pediátrica integral con calidez y profesionalismo.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
