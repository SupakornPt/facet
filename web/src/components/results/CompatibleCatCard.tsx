"use client";

import { PixelProfileBuddy } from "@/components/results/PixelProfileBuddy";

type Accent = "emerald" | "rose";

const accents: Record<
  Accent,
  { card: string; imageWell: string; footer: string; label: string }
> = {
  emerald: {
    card:
      "border-emerald-200/70 bg-white/90 shadow-[0_6px_22px_-10px_rgba(6,95,70,0.25),0_1px_0_rgba(255,255,255,0.95)_inset] ring-1 ring-emerald-100/80 hover:border-emerald-300/80 hover:shadow-[0_14px_34px_-14px_rgba(6,95,70,0.32)] dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:ring-emerald-900/40",
    imageWell:
      "bg-linear-to-b from-emerald-50/90 to-slate-50/50 dark:from-emerald-950/60 dark:to-slate-950/50",
    footer: "border-emerald-100/80 bg-white/90 dark:border-emerald-800/50 dark:bg-emerald-950/55",
    label: "text-emerald-950 dark:text-emerald-100",
  },
  rose: {
    card:
      "border-rose-200/70 bg-white/90 shadow-[0_6px_22px_-10px_rgba(190,24,93,0.2),0_1px_0_rgba(255,255,255,0.95)_inset] ring-1 ring-rose-100/80 hover:border-rose-300/80 hover:shadow-[0_14px_34px_-14px_rgba(190,24,93,0.28)] dark:border-rose-800/60 dark:bg-rose-950/40 dark:ring-rose-900/40",
    imageWell:
      "bg-linear-to-b from-rose-50/90 to-slate-50/50 dark:from-rose-950/55 dark:to-slate-950/50",
    footer: "border-rose-100/80 bg-white/90 dark:border-rose-800/50 dark:bg-rose-950/55",
    label: "text-rose-950 dark:text-rose-100",
  },
};

export function CompatibleCatCard({
  triSignature,
  variant,
  label,
  accent,
}: {
  triSignature: string;
  variant: number;
  label: string;
  accent: Accent;
}) {
  const a = accents[accent];

  return (
    <li className="min-w-0 list-none">
      <div
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition duration-300 ease-out hover:-translate-y-1 ${a.card}`}
      >
        <div className={`relative aspect-square w-full overflow-hidden ${a.imageWell}`}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.65),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.06),transparent_62%)]"
          />
          <PixelProfileBuddy
            triSignature={triSignature}
            variant={variant}
            label={label}
            fit="fill"
            fillObjectFit="cover"
          />
        </div>
        <div className={`border-t px-3.5 py-3.5 sm:px-4 sm:py-4 ${a.footer}`}>
          <p className={`text-center text-[0.8125rem] font-semibold leading-snug tracking-tight sm:text-sm ${a.label}`}>
            {label}
          </p>
        </div>
      </div>
    </li>
  );
}
