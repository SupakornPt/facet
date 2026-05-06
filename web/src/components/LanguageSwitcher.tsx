"use client";

import { useLocale } from "@/lib/locale";
import type { Locale } from "@/i18n/messages";
import { interpolate } from "@/i18n/messages";

type LanguageSwitcherProps = {
  variant?: "segmented" | "icon-toggle";
  className?: string;
};

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function LanguageSwitcher({
  variant = "segmented",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, m } = useLocale();

  function select(next: Locale) {
    if (next !== locale) setLocale(next);
  }

  if (variant === "icon-toggle") {
    const target: Locale = locale === "en" ? "th" : "en";
    const targetLabel = target === "en" ? m.language.en : m.language.th;
    const code = locale === "en" ? "EN" : "TH";
    return (
      <button
        type="button"
        onClick={() => select(target)}
        className={[
          "inline-flex h-8 shrink-0 items-center gap-px rounded-lg bg-transparent px-1 text-foreground transition hover:bg-app-elevated/80 active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        ].join(" ")}
        aria-label={interpolate(m.language.switchToOther, { lang: targetLabel })}
      >
        <GlobeIcon className="h-4 w-4 shrink-0 text-app-muted" />
        <span className="inline-flex w-8.5 shrink-0 select-none justify-center font-mono text-[0.65rem] font-bold tabular-nums tracking-wide text-app-muted">
          {code}
        </span>
      </button>
    );
  }

  return (
    <div
      className={[
        "flex items-center gap-1 rounded-xl border border-app-border bg-app-card/95 px-1 py-1 text-xs shadow-(--app-shadow) backdrop-blur-sm sm:rounded-2xl sm:px-1.5 sm:py-1.5 sm:text-sm",
        className,
      ].join(" ")}
      role="group"
      aria-label={m.language.label}
    >
      <span className="sr-only">{m.language.label}</span>
      <button
        type="button"
        onClick={() => select("en")}
        className={[
          "rounded-lg px-2.5 py-1 font-medium transition sm:rounded-xl sm:px-3 sm:py-1.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          locale === "en"
            ? "bg-app-primary text-app-on-primary shadow-sm"
            : "text-app-muted hover:bg-app-elevated",
        ].join(" ")}
      >
        {m.language.en}
      </button>
      <button
        type="button"
        onClick={() => select("th")}
        className={[
          "rounded-lg px-2.5 py-1 font-medium transition sm:rounded-xl sm:px-3 sm:py-1.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          locale === "th"
            ? "bg-app-primary text-app-on-primary shadow-sm"
            : "text-app-muted hover:bg-app-elevated",
        ].join(" ")}
      >
        {m.language.th}
      </button>
    </div>
  );
}
