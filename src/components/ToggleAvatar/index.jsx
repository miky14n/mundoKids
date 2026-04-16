"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

function IconChevron(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconKey(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.8 12.2 9.2-9.2M15 7l3 3M13 9l3 3" />
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
function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a8 8 0 0 0 0-6l1.6-1.3-2-3.4-2 .8a8 8 0 0 0-5.2-3L11.5 0h-4L7.2 2a8 8 0 0 0-5.2 3L0 4.3l-2 3.4 1.7 1.3a8 8 0 0 0 0 6L-2 16.3l2 3.4 2-.8a8 8 0 0 0 5.2 3L7.5 24h4l.3-2a8 8 0 0 0 5.2-3l2 .8 2-3.4z" />
    </svg>
  );
}
function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 17l5-5-5-5M20 12H9M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
    </svg>
  );
}

export default function ToggleAvatar({
  name = "?",
  avatarSrc = null,
  role = null,
}) {
  const roleAdmition = ["admin", "it"];
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name);
    }
  }, [name]);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const getInitial = (n) => (n ? n.charAt(0).toUpperCase() : "?");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 text-ink-muted transition hover:border-brand-200 hover:shadow-sog focus:outline-none"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white ring-2 ring-white">
          {avatarSrc ? (
            <Image
              className="rounded-full"
              width={36}
              height={36}
              alt="Avatar"
              src={avatarSrc}
            />
          ) : (
            getInitial(name)
          )}
        </span>
        <IconChevron className="h-4 w-4 text-ink-faint" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-pop">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">
              {name || "Usuario"}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">
              {role || "Sin rol"}
            </p>
          </div>
          <ul className="p-2">
            <li>
              <Link
                href="/auth/changePassword"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-slate-50 hover:text-ink"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <IconKey className="h-4 w-4" />
                </span>
                Cambiar contraseña
              </Link>
            </li>
            {roleAdmition.includes(role) && (
              <>
                <li>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-slate-50 hover:text-ink"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <IconUserPlus className="h-4 w-4" />
                    </span>
                    Registrar usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/administration/manage/users-list"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-slate-50 hover:text-ink"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <IconUsers className="h-4 w-4" />
                    </span>
                    Lista de usuarios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/administration/manage"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-slate-50 hover:text-ink"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <IconSettings className="h-4 w-4" />
                    </span>
                    Gestión clínica
                  </Link>
                </li>
              </>
            )}
            <li className="mt-1 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={handleClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <IconLogout className="h-4 w-4" />
                </span>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
