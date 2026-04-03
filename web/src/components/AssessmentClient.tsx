"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import questionsData from "@/data/questions.json";
import { LikertScale } from "@/components/LikertScale";
import { ProgressBar } from "@/components/ProgressBar";
import { allQuestionsAnswered } from "@/lib/scoring";
import { loadAnswers, saveAnswers } from "@/lib/storage";
import { useLocale } from "@/lib/locale";
import { localizedQuestionText, localizedScale } from "@/i18n/localizeQuestions";
import type { Question, QuestionsPayload } from "@/types/assessment";

const data = questionsData as QuestionsPayload;
const sortedQuestions = [...data.questions].sort((a, b) => a.id - b.id);
const QUESTIONS_PER_PAGE = 5;

export default function AssessmentClient() {
  const { locale, m } = useLocale();
  const scale = useMemo(
    () => localizedScale(data.scale, locale),
    [locale],
  );
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(
    () => loadAnswers() ?? {},
  );

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  const total = sortedQuestions.length;
  const totalPages = Math.max(1, Math.ceil(total / QUESTIONS_PER_PAGE));
  const pageStart = page * QUESTIONS_PER_PAGE;
  const pageQuestions = sortedQuestions.slice(
    pageStart,
    pageStart + QUESTIONS_PER_PAGE,
  );

  function setAnswerFor(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function pageFullyAnswered(qs: Question[]) {
    return qs.every((q) => answers[q.id] !== undefined);
  }

  function goNext() {
    if (!pageFullyAnswered(pageQuestions)) return;
    if (page < totalPages - 1) {
      setPage((p) => p + 1);
      return;
    }
    if (allQuestionsAnswered(sortedQuestions, answers)) {
      router.push("/results");
    }
  }

  function goPrev() {
    if (page > 0) setPage((p) => p - 1);
  }

  if (pageQuestions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-600">
        {m.assessment.loading}
      </div>
    );
  }

  const answeredCount = sortedQuestions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;
  const canProceed = pageFullyAnswered(pageQuestions);
  const isLastPage = page === totalPages - 1;
  const complete = allQuestionsAnswered(sortedQuestions, answers);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            {m.assessment.home}
          </Link>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {m.assessment.questionnaire}
          </span>
        </div>
        <ProgressBar
          value={answeredCount}
          max={total}
          label={m.assessment.progress}
        />
      </header>

      <main className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/50 sm:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {m.assessment.page} {page + 1} {m.assessment.of} {totalPages}
        </p>

        <div className="mt-8 space-y-6">
          {pageQuestions.map((q) => (
            <section key={q.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {m.assessment.question} {q.id}
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
                {localizedQuestionText(q, locale)}
              </h2>
              {q.expected !== undefined ? (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200/80">
                  {m.assessment.attentionHint}
                </p>
              ) : null}
              <div className="mt-6">
                <LikertScale
                  labels={scale}
                  value={answers[q.id]}
                  onChange={(v) => setAnswerFor(q.id, v)}
                />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {m.assessment.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed || (isLastPage && !complete)}
            className="rounded-xl bg-linear-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 hover:from-sky-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastPage ? m.assessment.viewResults : m.assessment.next}
          </button>
        </div>
      </main>
    </div>
  );
}
