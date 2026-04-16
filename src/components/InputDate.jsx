"use client";
import { useState } from "react";

export default function InputDate({ setDateBorn, label = "Fecha de nacimiento" }) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    setDateBorn(newValue);
  };

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-muted">{label}</span>
      <input
        type="date"
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </label>
  );
}
