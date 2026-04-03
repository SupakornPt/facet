"use client";

import { useLocale } from "@/lib/locale";
import type { Locale } from "@/i18n/messages";

export function LanguageSwitcher() {
  const { locale, setLocale, m } = useLocale();

  function select(next: Locale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <div
      className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-2 py-1.5 text-sm shadow-sm shadow-slate-200/50 backdrop-blur-sm"
      role="group"
      aria-label={m.language.label}
    >
      <span className="sr-only">{m.language.label}</span>
      <button
        type="button"
        onClick={() => select("en")}
        className={[
          "rounded-xl px-3 py-1.5 font-medium transition",
          locale === "en"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100",
        ].join(" ")}
      >
        {m.language.en}
      </button>
      <button
        type="button"
        onClick={() => select("th")}
        className={[
          "rounded-xl px-3 py-1.5 font-medium transition",
          locale === "th"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100",
        ].join(" ")}
      >
        {m.language.th}
      </button>
    </div>
  );
}
