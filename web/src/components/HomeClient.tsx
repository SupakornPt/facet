"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BeginAssessmentSubmitButton } from "@/components/BeginAssessmentLink";
import { useLocale } from "@/lib/locale";
import situationalQuestionsData from "@/data/situationalQuestions.json";
import { allQuestionsAnswered } from "@/lib/scoring";
import {
  clearAnswers,
  clearProfileName,
  loadAnswers,
  loadProfileName,
  saveProfileName,
} from "@/lib/storage";
import { useMemo, useState } from "react";
import type { QuestionsPayload } from "@/types/assessment";

const situationalPayload = situationalQuestionsData as QuestionsPayload;

const BEGIN_FORM_ID = "facet5-begin-assessment";

export function HomeClient() {
  const { m } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [profileName, setProfileName] = useState(() =>
    typeof window !== "undefined" ? loadProfileName() : "",
  );
  const [answersVersion, setAnswersVersion] = useState(0);
  const saved = useMemo<"none" | "partial" | "complete">(() => {
    void answersVersion;
    void pathname;
    const qs = situationalPayload.questions;
    const a = loadAnswers("situational");
    if (!a || Object.keys(a).length === 0) return "none";
    return allQuestionsAnswered(qs, a) ? "complete" : "partial";
  }, [answersVersion, pathname]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16">
      <div className="rounded-[1.75rem] border border-app-border bg-app-card/95 p-5 shadow-(--app-shadow-lg) backdrop-blur-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-app-primary">
          {m.home.badge}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {m.home.title}
        </h1>
        <div className="mt-8">
          <label htmlFor="facet5-profile-name" className="text-sm font-semibold text-foreground">
            {m.home.nameLabel}
          </label>
          <input
            id="facet5-profile-name"
            type="text"
            value={profileName}
            maxLength={80}
            autoComplete="name"
            form={saved === "none" ? BEGIN_FORM_ID : undefined}
            placeholder={m.home.namePlaceholder}
            onChange={(e) => {
              const v = e.target.value;
              setProfileName(v);
              saveProfileName(v);
            }}
            className="mt-2 w-full rounded-2xl border-2 border-app-border bg-app-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-app-subtle focus:border-app-primary focus:ring-2 focus:ring-app-ring/30"
          />
          <p className="mt-1.5 text-xs text-app-muted">{m.home.nameHint}</p>
        </div>
        {saved !== "none" ? (
          <p className="mt-8 rounded-xl border border-app-border bg-app-elevated px-4 py-3 text-sm text-app-muted">
            {m.home.progressSaved}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {saved === "partial" ? (
            <>
              <Link
                href="/assessment"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-app-primary px-6 py-3.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {m.home.continueAssessment}
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAnswers("situational");
                  clearProfileName();
                  setProfileName("");
                  setAnswersVersion((v) => v + 1);
                }}
                className="w-full rounded-2xl border-2 border-app-border px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-app-elevated sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {m.home.startNew}
              </button>
            </>
          ) : null}
          {saved === "complete" ? (
            <>
              <Link
                href="/results"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-app-primary px-6 py-3.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {m.home.viewResults}
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAnswers("situational");
                  clearProfileName();
                  setProfileName("");
                  setAnswersVersion((v) => v + 1);
                }}
                className="w-full rounded-2xl border-2 border-app-border px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-app-elevated sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {m.home.startNew}
              </button>
            </>
          ) : null}
          {saved === "none" ? (
            <form
              id={BEGIN_FORM_ID}
              className="contents"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/assessment");
              }}
            >
              <BeginAssessmentSubmitButton />
            </form>
          ) : null}
        </div>
      </div>
      <p className="text-center text-xs leading-relaxed text-app-subtle">{m.home.disclaimer}</p>
    </div>
  );
}
