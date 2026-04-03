"use client";

import { BeginAssessmentLink } from "@/components/BeginAssessmentLink";
import { useLocale } from "@/lib/locale";
import { interpolate } from "@/i18n/messages";

const QUESTION_COUNT = 62;

export function HomeClient() {
  const { m } = useLocale();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl shadow-blue-900/10 ring-1 ring-slate-200/80 backdrop-blur sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          {m.home.badge}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {m.home.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {interpolate(m.home.body, { count: QUESTION_COUNT })}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="text-blue-600">✓</span>
            {m.home.bullet1}
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">✓</span>
            {m.home.bullet2}
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">✓</span>
            {m.home.bullet3}
          </li>
        </ul>
        <div className="mt-10">
          <BeginAssessmentLink />
        </div>
      </div>
      <p className="text-center text-xs text-slate-500">{m.home.disclaimer}</p>
    </div>
  );
}
