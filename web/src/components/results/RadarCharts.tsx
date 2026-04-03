"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useLocale } from "@/lib/locale";

interface FacetPoint {
  name: string;
  score: number;
}

interface RadarChartsProps {
  mainFacets: FacetPoint[];
  subFacets: FacetPoint[];
}

export function RadarCharts({ mainFacets, subFacets }: RadarChartsProps) {
  const { m } = useLocale();
  const mainData = mainFacets.map((f) => ({
    name: f.name,
    score: Math.round(f.score * 10) / 10,
  }));
  const subData = subFacets.map((f) => ({
    name: f.name,
    score: Math.round(f.score * 10) / 10,
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/60">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          {m.results.radarMain}
        </h3>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mainData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Radar
                name={m.results.radarScore}
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.45}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/60">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          {m.results.radarSub}
        </h3>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 9 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 9 }}
              />
              <Radar
                name={m.results.radarScore}
                dataKey="score"
                stroke="#0ea5e9"
                fill="#38bdf8"
                fillOpacity={0.4}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
