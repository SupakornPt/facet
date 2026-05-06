"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLocale } from "@/lib/locale";

interface FacetPoint {
  name: string;
  score: number;
}

interface RadarChartsProps {
  mainFacets: FacetPoint[];
  subFacets: FacetPoint[];
  view?: "main" | "sub" | "both";
}

const tooltipBoxStyle: CSSProperties = {
  borderRadius: 12,
  border: "1px solid var(--app-border, #e2e8f0)",
  fontSize: 14,
  fontWeight: 500,
  boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
  backgroundColor: "var(--app-card, #ffffff)",
  color: "var(--foreground, #0f172a)",
  padding: "10px 12px",
};

function ScoreTooltip({
  scoreLabel,
  cursorStroke,
}: {
  scoreLabel: string;
  cursorStroke: string;
}) {
  return (
    <Tooltip
      cursor={{ stroke: cursorStroke, strokeWidth: 1, strokeOpacity: 0.35 }}
      contentStyle={tooltipBoxStyle}
      formatter={(raw: unknown) => {
        const n = typeof raw === "number" ? raw : Number(raw);
        const text =
          Number.isFinite(n) ? (Number.isInteger(n) ? `${n}` : n.toFixed(1)) : String(raw);
        return [text, scoreLabel];
      }}
      labelFormatter={(label: ReactNode) =>
        typeof label === "string" ? label : String(label ?? "")
      }
      labelStyle={{
        marginBottom: 6,
        fontWeight: 600,
        fontSize: 13,
        color: "#334155",
      }}
      itemStyle={{ fontSize: 15, fontWeight: 700, fontFeatureSettings: '"tnum"' }}
      wrapperStyle={{ outline: "none" }}
      isAnimationActive={false}
    />
  );
}

export function RadarCharts({ mainFacets, subFacets, view = "both" }: RadarChartsProps) {
  const { m } = useLocale();
  const mainData = mainFacets.map((f) => ({
    name: f.name,
    score: Math.round(f.score * 10) / 10,
  }));
  const subData = subFacets.map((f) => ({
    name: f.name,
    score: Math.round(f.score * 10) / 10,
  }));

  const angleTickMain = { fill: "#334155", fontSize: 14, fontWeight: 600 as const };
  const radiusTickMain = { fill: "#64748b", fontSize: 12, fontWeight: 500 as const };

  /** Sub-chart has many axes — keep glyphs readable without blowing layout. */
  const angleTickSub = { fill: "#334155", fontSize: 11, fontWeight: 500 as const };
  const radiusTickSub = { fill: "#64748b", fontSize: 10, fontWeight: 500 as const };

  return (
    <div className={view === "both" ? "grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10" : "grid gap-6 md:gap-8 lg:gap-10"}>
      {(view === "both" || view === "main") ? (
        <div className="rounded-2xl border border-app-border bg-app-card p-4 shadow-(--app-shadow) sm:p-5 md:p-6">
        <h3 className="mb-2 text-center text-base font-semibold uppercase tracking-[0.08em] text-foreground sm:mb-3 sm:text-lg">
          {m.results.radarMain}
        </h3>
        <div className="h-[clamp(320px,46vw,400px)] min-h-[320px] w-full sm:h-[360px] md:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              margin={{ top: 12, right: 20, bottom: 12, left: 20 }}
              data={mainData}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="name"
                tick={angleTickMain}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={radiusTickMain}
              />
              <ScoreTooltip scoreLabel={m.results.radarScore} cursorStroke="#0f766e" />
              <Radar
                name={m.results.radarScore}
                dataKey="score"
                stroke="#0f766e"
                fill="#14b8a6"
                fillOpacity={0.45}
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#0f766e",
                  fillOpacity: 0.85,
                  stroke: "#fff",
                  strokeWidth: 1.5,
                }}
                activeDot={{
                  r: 6,
                  fill: "#0d9488",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      ) : null}

      {(view === "both" || view === "sub") ? (
        <div className="rounded-2xl border border-app-border bg-app-card p-4 shadow-(--app-shadow) sm:p-5 md:p-6">
        <h3 className="mb-2 text-center text-base font-semibold uppercase tracking-[0.08em] text-foreground sm:mb-3 sm:text-lg">
          {m.results.radarSub}
        </h3>
        <div className="h-[clamp(380px,62vw,520px)] min-h-[380px] w-full md:h-[440px] lg:h-[480px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="58%"
              margin={{ top: 18, right: 28, bottom: 22, left: 28 }}
              data={subData}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={angleTickSub} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={radiusTickSub}
              />
              <ScoreTooltip scoreLabel={m.results.radarScore} cursorStroke="#0d9488" />
              <Radar
                name={m.results.radarScore}
                dataKey="score"
                stroke="#0d9488"
                fill="#2dd4bf"
                fillOpacity={0.38}
                strokeWidth={1.5}
                dot={{
                  r: 2.5,
                  fill: "#0d9488",
                  fillOpacity: 0.9,
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 5,
                  fill: "#0f766e",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      ) : null}
    </div>
  );
}
