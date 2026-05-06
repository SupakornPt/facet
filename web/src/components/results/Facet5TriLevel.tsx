"use client";

import type { MainFactor } from "@/types/assessment";
import type { Messages } from "@/i18n/messages";
import { facetNarrative } from "@/lib/interpretations";
import { FACTOR_ORDER, scoreToTriLevel } from "@/lib/facetTriLevel";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel } from "@/i18n/labels";
import type { TriLevel } from "@/i18n/triLevelMeta";
import { triMeta } from "@/i18n/triLevelMeta";

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
        pill: "bg-teal-50 text-teal-900 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-100 dark:ring-teal-800",
        glow: "from-teal-200/25 via-cyan-200/15 to-fuchsia-200/15",
      };
    case "Low":
      return {
        pill: "bg-slate-50 text-slate-800 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-100 dark:ring-slate-600",
        glow: "from-slate-300/20 via-teal-200/10 to-fuchsia-200/10",
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
    <section className="relative overflow-hidden rounded-3xl border border-app-border bg-app-card p-5 shadow-(--app-shadow-lg) sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(20,184,166,0.18),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(217,70,239,0.12),transparent_40%),radial-gradient(circle_at_70%_85%,rgba(16,185,129,0.14),transparent_42%)]"
      />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-app-primary">
              {m.triLevel.badge}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {m.triLevel.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-app-muted">
              {m.triLevel.body}
              <span className="font-semibold">{m.triLevel.bodyLow}</span>,{" "}
              <span className="font-semibold">{m.triLevel.bodyMid}</span>,{" "}
              <span className="font-semibold">{m.triLevel.bodyOr}</span>
              <span className="font-semibold">{m.triLevel.bodyHigh}</span>
              {m.triLevel.bodySuffix}
            </p>
          </div>

          <div className="rounded-2xl border border-app-border bg-app-elevated/90 px-4 py-3 shadow-(--app-shadow) md:min-w-60">
            <div className="text-xs font-medium uppercase tracking-wide text-app-subtle">
              {m.triLevel.codeLabel}
            </div>
            <div className="mt-1 bg-linear-to-r from-teal-700 via-teal-600 to-fuchsia-700 bg-clip-text font-mono text-2xl font-semibold tracking-widest text-transparent dark:from-teal-300 dark:via-teal-200 dark:to-fuchsia-300">
              {overallCode}
            </div>
            <div className="mt-1 text-xs leading-relaxed text-app-muted">{overallMeaning}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FACTOR_ORDER.map((factor) => {
            const score = factorByName.get(factor) ?? 0;
            const level = scoreToTriLevel(score);
            const meta = triMeta(factor, level, locale);
            const n = facetNarrative(factor, score, locale);
            const styles = levelStyles(level);

            return (
              <article
                key={factor}
                className="relative overflow-hidden rounded-2xl border border-app-border bg-app-card/90 p-4 shadow-(--app-shadow)"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-linear-to-br ${styles.glow} opacity-85`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
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
                      <div className="font-mono text-3xl font-semibold tracking-widest text-foreground">
                        {meta.code}
                      </div>
                      <div className="text-xs font-medium text-app-muted">
                        {meta.meaning}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-foreground">
                    {n.headline}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-app-muted">
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
