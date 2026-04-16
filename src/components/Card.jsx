import Image from "next/image";
import Link from "next/link";

function IconArrow(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Card(params) {
  const tone = params.tone || "brand";
  const tones = {
    brand: {
      iconWrap: "bg-brand-50 ring-brand-100",
      accent: "from-brand-50 to-white",
      chip: "bg-brand-100 text-brand-700",
      btn: "bg-brand-700 hover:bg-brand-800 text-white",
    },
    accent: {
      iconWrap: "bg-accent-50 ring-accent-100",
      accent: "from-accent-50 to-white",
      chip: "bg-accent-100 text-accent-600",
      btn: "bg-accent-500 hover:bg-accent-600 text-white",
    },
    neutral: {
      iconWrap: "bg-slate-50 ring-slate-100",
      accent: "from-slate-50 to-white",
      chip: "bg-slate-100 text-ink-muted",
      btn: "bg-ink text-white hover:bg-slate-800",
    },
  };
  const t = tones[tone] || tones.brand;

  return (
    <Link href={params.path} className="group block">
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b ${t.accent} p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card`}
      >
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${t.iconWrap}`}
          >
            <Image
              src={params.img}
              alt={params.title}
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
            />
          </div>
          {params.badge && (
            <span className={`pill ${t.chip}`}>{params.badge}</span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-ink">{params.title}</h3>
        <p className="mb-6 flex-grow text-sm leading-relaxed text-ink-soft">
          {params.description}
        </p>
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${t.btn}`}
        >
          {params.titleButton}
          <IconArrow className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
