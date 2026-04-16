import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-50 px-6">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent-100/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-pop backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-brand-700"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 1 1 8 0v4" />
          </svg>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-700">
          Error 403
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          No tienes acceso a esta página
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Tu rol no cuenta con los permisos necesarios para ver este contenido.
          Si crees que es un error, contacta al administrador del sistema.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
