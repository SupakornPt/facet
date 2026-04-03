"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LOCAL_STORAGE_KEY,
  messages,
  type Locale,
  type Messages,
} from "@/i18n/messages";

export type { Locale };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "th") setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale === "th" ? "th" : "en";
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale, hydrated]);

  const m = messages[locale];

  const value = useMemo(
    () => ({ locale, setLocale, m }),
    [locale, setLocale, m],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
