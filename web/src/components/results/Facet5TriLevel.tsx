"use client";

import type { MainFactor } from "@/types/assessment";
import type { Messages } from "@/i18n/messages";
import { facetNarrative } from "@/lib/interpretations";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel } from "@/i18n/labels";
import type { TriLevel } from "@/i18n/triLevelMeta";
import { triMeta } from "@/i18n/triLevelMeta";

const FACTOR_ORDER: MainFactor[] = [
  "Will",
  "Energy",
  "Affection",
  "Control",
  "Emotionality",
];

function scoreToTriLevel(score: number): TriLevel {
  if (score < 40) return "Low";
  if (score < 75) return "Mid";
  return "High";
}

function previewText(text: string, maxLen = 140) {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen).trim()}…`;
}

function levelStyles(level: TriLevel) {
  switch (level) {
    case "High":
      return {
        pill: "bg-emerald-50 text-emerald-800 ring-emerald-200",
        glow: "from-emerald-200/30 via-sky-200/20 to-fuchsia-200/20",
      };
    case "Mid":
      return {
        pill: "bg-sky-50 text-sky-800 ring-sky-200",
        glow: "from-sky-200/25 via-blue-200/15 to-fuchsia-200/15",
      };
    case "Low":
      return {
        pill: "bg-slate-50 text-slate-800 ring-slate-200",
        glow: "from-slate-300/20 via-sky-200/10 to-fuchsia-200/10",
      };
  }
}

function triLevelDisplay(level: TriLevel, tri: Messages["triLevel"]): string {
  switch (level) {
    case "Low":
      return tri.levelLow;
    case "Mid":
      return tri.levelMid;
    case "High":
      return tri.levelHigh;
  }
}

export function Facet5TriLevel({
  factors,
}: {
  factors: { factor: MainFactor; score: number }[];
}) {
  const { locale, m } = useLocale();
  const factorByName = new Map(factors.map((f) => [f.factor, f.score]));

  const codes = FACTOR_ORDER.map((factor) => {
    const score = factorByName.get(factor) ?? 0;
    const level = scoreToTriLevel(score);
    return triMeta(factor, level, locale).code;
  });

  const meanings = FACTOR_ORDER.map((factor) => {
    const score = factorByName.get(factor) ?? 0;
    const level = scoreToTriLevel(score);
    return triMeta(factor, level, locale).meaning;
  });

  const overallCode = codes.join("-");
  const overallMeaning = meanings.join(" • ");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-white/60 p-6 shadow-[0_30px_110px_-70px_rgba(14,165,233,0.85)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.35),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(217,70,239,0.22),transparent_40%),radial-gradient(circle_at_70%_85%,rgba(16,185,129,0.18),transparent_42%)]"
      />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-900/70">
              {m.triLevel.badge}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {m.triLevel.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
              {m.triLevel.body}
              <span className="font-semibold">{m.triLevel.bodyLow}</span>,{" "}
              <span className="font-semibold">{m.triLevel.bodyMid}</span>,{" "}
              <span className="font-semibold">{m.triLevel.bodyOr}</span>
              <span className="font-semibold">{m.triLevel.bodyHigh}</span>
              {m.triLevel.bodySuffix}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200/70 bg-white/70 px-4 py-3 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-sky-900/60">
              {m.triLevel.codeLabel}
            </div>
            <div className="mt-1 font-mono text-2xl font-semibold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-sky-700 via-blue-700 to-fuchsia-700">
              {overallCode}
            </div>
            <div className="mt-1 text-xs text-slate-700">{overallMeaning}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {FACTOR_ORDER.map((factor) => {
            const score = factorByName.get(factor) ?? 0;
            const level = scoreToTriLevel(score);
            const meta = triMeta(factor, level, locale);
            const n = facetNarrative(factor, score, locale);
            const styles = levelStyles(level);

            return (
              <article
                key={factor}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-linear-to-br ${styles.glow} opacity-85`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {mainFactorLabel(factor, locale)}
                      </h3>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${styles.pill}`}
                        >
                          {triLevelDisplay(level, m.triLevel)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-3xl font-semibold tracking-widest text-slate-900">
                        {meta.code}
                      </div>
                      <div className="text-xs font-medium text-slate-700">
                        {meta.meaning}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-800">
                    {n.headline}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {previewText(n.detail)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
