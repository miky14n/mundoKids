"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Card from "../components/Card";

function IconUserPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21a6 6 0 0 1 12 0M19 8v6M16 11h6" />
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
function IconSyringe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m18 2 4 4M15 5l4 4M11 9l5 5M5 22l-3-3 10-10 3 3zM9 13l2 2" />
    </svg>
  );
}
function IconClipboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
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
function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18M7 14l4-4 4 4 5-6" />
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

function QuickLink({ href, icon: Icon, label, description }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {label}
        </span>
        <span className="block truncate text-xs text-ink-soft">
          {description}
        </span>
      </span>
      <svg className="h-4 w-4 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const userName = session?.user?.name || "";
  const firstName = userName.split(" ")[0] || "Bienvenido";

  const hiddenForDoctor = role === "doctor";

  const propsRegister = {
    img: "/kids.png",
    title: "Registrar paciente",
    description:
      "Registra un nuevo paciente pediátrico con sus datos completos y los de su tutor.",
    path: "/register",
    titleButton: "Registrar paciente",
    badge: "Nuevo",
    tone: "brand",
  };
  const propsConsult = {
    img: "/consulta.png",
    title: "Agendar consulta",
    description:
      "Programa una consulta para pacientes ya registrados en la clínica.",
    path: "/medical-appointment",
    titleButton: "Agendar consulta",
    badge: "Frecuente",
    tone: "accent",
  };
  const propsServices = {
    img: "/Services.png",
    title: "Registrar servicio",
    description:
      "Registra servicios médicos externos a consulta como aplicaciones, exámenes y más.",
    path: "/medical-services",
    titleButton: "Registrar servicio",
    tone: "neutral",
  };

  const today = new Date();
  const dateLabel = today.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="surface-card relative mb-8 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-48 w-48 rounded-full bg-accent-100/60 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {dateLabel}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Hola, {firstName} <span className="inline-block animate-pulse text-accent-500">·</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Bienvenida al sistema de gestión de Mundo Kids. Accede rápidamente
              a las tareas más comunes desde esta pantalla.
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 sm:items-end">
            <span className="pill bg-white text-brand-700 ring-1 ring-brand-100">
              <IconHeart className="h-3.5 w-3.5" />
              Atención pediátrica
            </span>
            <p className="text-xs text-ink-soft">Cuidamos a tu familia con calidez.</p>
          </div>
        </div>
      </section>

      {/* Primary actions */}
      <section className="mb-8">
        <div className="page-header">
          <div>
            <h3 className="section-title">Accesos rápidos</h3>
            <p className="page-subtitle">Las tareas más frecuentes del día a día.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card {...propsRegister} />
          <Card {...propsConsult} />
          <Card {...propsServices} />
        </div>
      </section>

      {/* Secondary navigation */}
      <section>
        <div className="page-header">
          <div>
            <h3 className="section-title">Más herramientas</h3>
            <p className="page-subtitle">
              Navega al resto del sistema según tu rol ({role || "—"}).
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/medical-history"
            icon={IconClipboard}
            label="Historial clínico"
            description="Consulta y detalle de pacientes"
          />
          {!hiddenForDoctor && (
            <QuickLink
              href="/noursing"
              icon={IconUserPlus}
              label="Enfermería"
              description="Signos vitales y toma de medidas"
            />
          )}
          <QuickLink
            href="/medical-services/listOfServices"
            icon={IconSyringe}
            label="Lista de servicios"
            description="Catálogo de especialidades"
          />
          {!hiddenForDoctor && (
            <QuickLink
              href="/administration"
              icon={IconChart}
              label="Reportes"
              description="Indicadores y exportación"
            />
          )}
          {!hiddenForDoctor && (
            <QuickLink
              href="/contributions"
              icon={IconCoin}
              label="Aportes"
              description="Registro de aportes médicos"
            />
          )}
          {!hiddenForDoctor && (
            <QuickLink
              href="/medical-appointment"
              icon={IconCalendar}
              label="Agendar consulta"
              description="Nueva cita médica"
            />
          )}
        </div>
      </section>
    </div>
  );
}
