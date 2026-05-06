"use client";

import type { QualityMetrics } from "@/types/assessment";
import { useLocale } from "@/lib/locale";
import { interpolate } from "@/i18n/messages";

interface QualityPanelProps {
  quality: QualityMetrics;
}

export function QualityPanel({ quality }: QualityPanelProps) {
  const { m } = useLocale();
  return (
    <section className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900/80">
        {m.quality.title}
      </h3>
      <p className="mt-1 text-sm text-amber-950/70">{m.quality.subtitle}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-app-muted">{m.quality.sdLabel}</dt>
          <dd className="font-semibold text-foreground">
            {Math.round(quality.socialDesirabilityIndex)} / 100
          </dd>
        </div>
        <div>
          <dt className="text-app-muted">{m.quality.attentionLabel}</dt>
          <dd
            className={
              quality.attentionPass
                ? "font-semibold text-emerald-700"
                : "font-semibold text-rose-700"
            }
          >
            {quality.attentionPass ? m.quality.passed : m.quality.review}
          </dd>
        </div>
      </dl>
      {!quality.attentionPass ? (
        <ul className="mt-3 list-inside list-disc text-sm text-rose-800">
          {quality.attentionDetail
            .filter((d) => !d.ok)
            .map((d) => (
              <li key={d.id}>
                {interpolate(m.quality.failItem, { id: d.id })}
              </li>
            ))}
        </ul>
      ) : null}
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-app-subtle">
          {m.quality.consistencyTitle}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {quality.consistencyPairs.map((p) => (
            <li
              key={`${p.a}-${p.b}`}
              className="rounded-lg border border-app-border bg-app-card px-2 py-1 text-xs text-foreground"
            >
              Q{p.a}/Q{p.b}: Δ {p.diff.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
