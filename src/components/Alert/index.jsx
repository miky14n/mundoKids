"use client";
import { useState } from "react";

const palettes = {
  success: {
    wrap: "bg-emerald-50 border-emerald-200 text-emerald-900",
    icon: "bg-emerald-100 text-emerald-700",
    close: "text-emerald-700 hover:bg-emerald-100",
  },
  danger: {
    wrap: "bg-red-50 border-red-200 text-red-900",
    icon: "bg-red-100 text-red-700",
    close: "text-red-700 hover:bg-red-100",
  },
  error: {
    wrap: "bg-red-50 border-red-200 text-red-900",
    icon: "bg-red-100 text-red-700",
    close: "text-red-700 hover:bg-red-100",
  },
  warning: {
    wrap: "bg-amber-50 border-amber-200 text-amber-900",
    icon: "bg-amber-100 text-amber-700",
    close: "text-amber-700 hover:bg-amber-100",
  },
  info: {
    wrap: "bg-brand-50 border-brand-200 text-brand-900",
    icon: "bg-brand-100 text-brand-700",
    close: "text-brand-700 hover:bg-brand-100",
  },
};

function IconSuccess(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconInfo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Alert({ message, color = "info", link, setStatus = () => {} }) {
  const [isVisible, setIsVisible] = useState(true);
  const palette = palettes[color] || palettes.info;

  if (!isVisible) return null;

  const Icon = color === "success" ? IconSuccess : IconInfo;

  return (
    <div
      className={`mx-auto flex w-full max-w-5xl items-start gap-3 rounded-2xl border p-4 shadow-soft ${palette.wrap}`}
      role="alert"
    >
      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${palette.icon}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message}
        {link && (
          <a href={link} className="ml-2 font-semibold underline hover:no-underline">
            ver más
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setStatus(null);
        }}
        className={`-m-1 flex h-8 w-8 items-center justify-center rounded-lg transition ${palette.close}`}
        aria-label="Cerrar"
      >
        <IconX className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
