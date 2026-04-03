"use client";

import { useLocale } from "@/lib/locale";

export function SkipToContent() {
  const { m } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
    >
      {m.skipToContent}
    </a>
  );
}
