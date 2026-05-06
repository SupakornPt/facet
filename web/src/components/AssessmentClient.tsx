"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import situationalQuestionsData from "@/data/situationalQuestions.json";
import { LikertScale } from "@/components/LikertScale";
import { ProgressBar } from "@/components/ProgressBar";
import { allQuestionsAnswered } from "@/lib/scoring";
import { sortQuestionsForFlow } from "@/lib/assessmentFlow";
import { QUESTIONS_PER_PAGE } from "@/lib/assessmentPace";
import { loadAnswers, saveAnswers } from "@/lib/storage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/lib/locale";
import { localizedQuestionText } from "@/i18n/localizeQuestions";
import type { Question, QuestionsPayload } from "@/types/assessment";

const situationalData = situationalQuestionsData as QuestionsPayload;

export default function AssessmentClient() {
  const { locale, m } = useLocale();
  const questionsPerPage = QUESTIONS_PER_PAGE;
  const data = situationalData;
  const scale = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data.scale).map(([k, v]) => [
          k,
          locale === "th" ? `${v}. ตัวเลือกที่ ${k}` : `${v}. Option ${k}`,
        ]),
      ),
    [data.scale, locale],
  );
  const router = useRouter();
  const sortedQuestions = useMemo(
    () => sortQuestionsForFlow(data.questions),
    [data.questions],
  );
  const [page, setPage] = useState(0);

  const [answers, setAnswers] = useState<Record<number, number>>(
    () => loadAnswers("situational") ?? {},
  );

  useEffect(() => {
    saveAnswers("situational", answers);
  }, [answers]);

  const total = sortedQuestions.length;
  const totalPages = Math.max(1, Math.ceil(total / questionsPerPage));
  const pageStart = page * questionsPerPage;
  const pageQuestions = sortedQuestions.slice(
    pageStart,
    pageStart + questionsPerPage,
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
      <div className="flex flex-1 items-center justify-center text-app-muted">
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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header
        style={{ backgroundColor: "var(--app-header-bg)" }}
        className="sticky top-0 z-20 mb-4 space-y-4 rounded-2xl border border-app-border px-5 py-5 shadow-(--app-shadow) backdrop-blur-md sm:mb-6 sm:px-6 sm:py-6"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-app-primary transition hover:text-app-primary-hover"
          >
            {m.assessment.home}
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-2.5">
            <span className="max-w-[min(100%,12rem)] text-right text-[0.65rem] font-semibold uppercase leading-snug tracking-wider text-app-muted sm:max-w-none sm:text-xs">
              {m.assessment.questionnaire} · {m.assessment.modeSituational}
            </span>
            <LanguageSwitcher
              variant="icon-toggle"
              className="lg:hidden"
            />
          </div>
        </div>
        <ProgressBar
          value={answeredCount}
          max={total}
          label={m.assessment.progress}
        />
        {answeredCount > 0 && !complete ? (
          <p className="text-center text-xs leading-relaxed text-app-muted">
            {m.assessment.keepGoing}
          </p>
        ) : null}
      </header>

      <main className="rounded-[1.75rem] border border-app-border bg-app-card p-5 shadow-(--app-shadow-lg) sm:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-app-subtle">
          {m.assessment.page}{" "}
          <span className="font-thai-numerals">{page + 1}</span> {m.assessment.of}{" "}
          <span className="font-thai-numerals">{totalPages}</span>
        </p>

        <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
          {pageQuestions.map((q, idx) => (
            <section
              key={q.id}
              className={
                idx < pageQuestions.length - 1
                  ? "border-b border-app-border pb-10 sm:pb-12"
                  : ""
              }
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-app-primary">
                {m.assessment.question}{" "}
                <span className="font-thai-numerals">{q.id}</span>
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl sm:leading-snug">
                {localizedQuestionText(q, locale)}
              </h2>
              {q.expected !== undefined ? (
                <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                  {m.assessment.attentionHint}
                </p>
              ) : null}
              <div className="mt-6 sm:mt-8">
                <LikertScale
                  labels={
                    q.choices
                      ? Object.fromEntries(
                          q.choices.map((choice, cIdx) => [
                            String(cIdx + 1),
                            `${choice.key}. ${locale === "th" ? (choice.textTh ?? choice.text) : choice.text}`,
                          ]),
                        )
                      : scale
                  }
                  value={answers[q.id]}
                  onChange={(v) => setAnswerFor(q.id, v)}
                />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-between sm:gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            className="w-full rounded-2xl border-2 border-app-border bg-app-card px-5 py-3 text-sm font-medium text-foreground transition hover:border-app-border-strong hover:bg-app-elevated disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {m.assessment.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed || (isLastPage && !complete)}
            className="w-full rounded-2xl bg-app-primary px-6 py-3 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isLastPage ? m.assessment.viewResults : m.assessment.next}
          </button>
        </div>
      </main>
    </div>
  );
}
