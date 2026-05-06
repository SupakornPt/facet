"use client";

import { useLocale } from "@/lib/locale";

export function SkipToContent() {
  const { m } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:border-2 focus:border-app-border focus:bg-app-card focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-[var(--app-shadow-lg)] focus:ring-2 focus:ring-app-ring"
    >
      {m.skipToContent}
    </a>
  );
}
