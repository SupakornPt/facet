"use client";

import type { SubFacetResult } from "@/types/assessment";
import { subFacetsForDevelopment } from "@/lib/developmentFocus";
import { developmentHintForSubFacet } from "@/i18n/developmentHints";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel, subFacetLabel } from "@/i18n/labels";

interface DevelopmentAreasProps {
  subFacets: SubFacetResult[];
}

export function DevelopmentAreas({ subFacets }: DevelopmentAreasProps) {
  const { locale, m } = useLocale();
  const focus = subFacetsForDevelopment(subFacets, 5);
  if (focus.length === 0) return null;

  return (
    <section className="rounded-3xl border border-app-border bg-app-card p-6 shadow-[var(--app-shadow)] sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        {m.results.developmentTitle}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-app-muted">
        {m.results.developmentSubtitle}
      </p>
      <ul className="mt-6 space-y-4">
        {focus.map((s) => {
          const hint = developmentHintForSubFacet(s.name, locale);
          return (
            <li
              key={s.name}
              className="rounded-2xl border border-app-border bg-app-elevated p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {subFacetLabel(s.name, locale)}
                </span>
                <span className="text-xs font-medium text-app-subtle">
                  {m.results.developmentUnderFactor}{" "}
                  {mainFactorLabel(s.factor, locale)}
                </span>
              </div>
              {hint ? (
                <p className="mt-2 text-sm leading-relaxed text-app-muted">
                  {hint}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
