"use client";

import { useState } from "react";

export default function ToggleSwitch({ status, title = "" }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
    status(!isChecked);
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-3 select-none">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isChecked}
          onChange={handleChange}
        />
        <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-brand-600 peer-focus:ring-4 peer-focus:ring-brand-100" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
      <span className="text-sm font-medium text-ink-muted">{title}</span>
    </label>
  );
}
