"use client";

import { forwardRef } from "react";
import type { AssessmentResult } from "@/types/assessment";
import {
  FACTOR_ORDER,
  overallTriCode,
  scoreToTriLevel,
  triMeaningSummary,
} from "@/lib/facetTriLevel";
import { facetNarrative } from "@/lib/interpretations";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel, subFacetLabel } from "@/i18n/labels";
import { subFacetsForDevelopment } from "@/lib/developmentFocus";
import { profileBuddyIndex } from "@/lib/profileBuddy";
import { triMeta } from "@/i18n/triLevelMeta";
import { PixelProfileBuddy } from "@/components/results/PixelProfileBuddy";

export const ResultShareCard = forwardRef<
  HTMLDivElement,
  { result: AssessmentResult }
>(function ResultShareCard({ result }, ref) {
  const { locale, m } = useLocale();
  const dev = subFacetsForDevelopment(result.subFacets, 3);
  const mode = m.assessment.modeSituational;

  const byName = new Map(result.factors.map((f) => [f.factor, f.score]));
  const triCode = overallTriCode(result.factors, locale);
  const meaningLine = triMeaningSummary(result.factors, locale);
  const buddyIdx = profileBuddyIndex(triCode);
  const buddyName =
    m.results.shareBuddyNames[buddyIdx] ?? m.results.shareBuddyNames[0];
  const buddyAriaLabel = `${buddyName}. ${m.results.shareBuddyCaption}`;

  return (
    <div
      ref={ref}
      style={{
        width: 580,
        boxSizing: "border-box",
        padding: 28,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: "#0f172a",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#0d9488" }}
          >
            Facet5-style
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700 }}>
            {m.results.shareHeadline}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b" }}>
            {m.results.modePrefix}: {mode}
          </p>
          <p
            style={{
              margin: "16px 0 4px",
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {m.triLevel.codeLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.12em",
              color: "#0f766e",
            }}
          >
            {triCode}
          </p>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 11,
              lineHeight: 1.45,
              color: "#64748b",
            }}
          >
            {meaningLine}
          </p>
        </div>
        <div
          style={{
            flexShrink: 0,
            width: 236,
            textAlign: "center",
            paddingTop: 4,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1",
              margin: "0 auto",
              maxWidth: 228,
              boxSizing: "border-box",
            }}
          >
            <PixelProfileBuddy
              triSignature={triCode}
              variant={buddyIdx}
              label={buddyAriaLabel}
              fit="fill"
            />
          </div>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
              maxWidth: 236,
              lineHeight: 1.25,
            }}
          >
            {buddyName}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 9,
              fontWeight: 600,
              color: "#94a3b8",
              maxWidth: 236,
              lineHeight: 1.3,
            }}
          >
            {m.results.shareBuddyCaption}
          </p>
        </div>
      </div>

      <p style={{ margin: "20px 0 10px", fontSize: 13, fontWeight: 700 }}>
        {m.results.shareStyleSnapshotLabel}
      </p>
      {FACTOR_ORDER.map((factor) => {
        const score = byName.get(factor) ?? 0;
        const meta = triMeta(factor, scoreToTriLevel(score), locale);
        const n = facetNarrative(factor, score, locale);
        return (
          <div key={factor} style={{ marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              {mainFactorLabel(factor, locale)} — {meta.meaning}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                lineHeight: 1.45,
                color: "#475569",
              }}
            >
              {n.headline}
            </p>
          </div>
        );
      })}

      {dev.length ? (
        <>
          <p style={{ margin: "18px 0 8px", fontSize: 13, fontWeight: 700 }}>
            {m.results.shareDevelopmentLabel}
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 12,
              color: "#334155",
              lineHeight: 1.5,
            }}
          >
            {dev.map((s) => (
              <li key={s.name} style={{ marginBottom: 4 }}>
                {subFacetLabel(s.name, locale)}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p
        style={{
          margin: "20px 0 0",
          fontSize: 10,
          color: "#94a3b8",
          lineHeight: 1.45,
        }}
      >
        {m.results.shareCardFoot}
      </p>
    </div>
  );
});
