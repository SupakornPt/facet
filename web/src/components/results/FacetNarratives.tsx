"use client";

import type { MainFactor } from "@/types/assessment";
import { facetNarrative } from "@/lib/interpretations";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel } from "@/i18n/labels";

interface FacetNarrativesProps {
  factors: { factor: MainFactor; score: number }[];
}

export function FacetNarratives({ factors }: FacetNarrativesProps) {
  const { locale } = useLocale();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {factors.map(({ factor, score }) => {
        const n = facetNarrative(factor, score, locale);
        return (
          <article
            key={factor}
            className="rounded-2xl border border-app-border bg-linear-to-br from-app-card to-app-elevated p-5 shadow-[var(--app-shadow)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                {mainFactorLabel(factor, locale)}
              </h3>
              <span className="rounded-full bg-app-primary-soft px-2.5 py-0.5 text-xs font-medium text-app-primary">
                {n.bandLabel} · {Math.round(score)}
              </span>
            </div>
            <p className="mt-2 font-medium text-foreground">{n.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-app-muted">
              {n.detail}
            </p>
          </article>
        );
      })}
    </div>
  );
}
