"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import questionsData from "@/data/questions.json";
import { RadarCharts } from "@/components/results/RadarCharts";
import { FacetNarratives } from "@/components/results/FacetNarratives";
import { Facet5TriLevel } from "@/components/results/Facet5TriLevel";
import { QualityPanel } from "@/components/results/QualityPanel";
import { allQuestionsAnswered, computeAssessment } from "@/lib/scoring";
import { clearAnswers, loadAnswers } from "@/lib/storage";
import { useLocale } from "@/lib/locale";
import { mainFactorLabel, subFacetLabel } from "@/i18n/labels";
import type { QuestionsPayload } from "@/types/assessment";

const data = questionsData as QuestionsPayload;

function IntroWithCode({ intro, code }: { intro: string; code: string }) {
  const parts = intro.split(code);
  if (parts.length === 2) {
    return (
      <p className="mt-2 max-w-2xl text-slate-600">
        {parts[0]}
        <code className="rounded bg-slate-100 px-1 text-sm">{code}</code>
        {parts[1]}
      </p>
    );
  }
  return <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>;
}

export default function ResultsClient() {
  const { locale, m } = useLocale();
  const router = useRouter();

  const result = useMemo(() => {
    const answers = loadAnswers();
    if (!answers || !allQuestionsAnswered(data.questions, answers)) return null;
    return computeAssessment(data, answers);
  }, []);

  useEffect(() => {
    if (!result) router.replace("/assessment");
  }, [result, router]);

  const mainPoints = useMemo(() => {
    if (!result) return [];
    return result.factors.map((f) => ({
      name: mainFactorLabel(f.factor, locale),
      score: f.score,
    }));
  }, [result, locale]);

  const subPoints = useMemo(() => {
    if (!result) return [];
    return result.subFacets.map((s) => ({
      name: subFacetLabel(s.name, locale),
      score: s.score,
    }));
  }, [result, locale]);

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-600">
        {m.results.preparing}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {m.results.badge}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {m.results.title}
          </h1>
          <IntroWithCode intro={m.results.intro} code={m.results.introCode} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/assessment"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {m.results.review}
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAnswers();
              router.push("/");
            }}
            className="rounded-xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:from-sky-500 hover:to-blue-600"
          >
            {m.results.startOver}
          </button>
    </div>
      </header>

      <RadarCharts mainFacets={mainPoints} subFacets={subPoints} />

      <Facet5TriLevel factors={result.factors} />

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {m.results.whatThisSuggests}
        </h2>
        <FacetNarratives factors={result.factors} />
      </section>

      <QualityPanel quality={result.quality} />
    </div>
  );
}
