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
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {mainFactorLabel(factor, locale)}
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {n.bandLabel} · {Math.round(score)}
              </span>
            </div>
            <p className="mt-2 font-medium text-slate-800">{n.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {n.detail}
            </p>
          </article>
        );
      })}
    </div>
  );
}
