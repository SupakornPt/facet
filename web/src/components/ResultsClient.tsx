"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { ReviewAssessmentLink } from "@/components/ReviewAssessmentLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import situationalQuestionsData from "@/data/situationalQuestions.json";
import { RadarCharts } from "@/components/results/RadarCharts";
import { Facet5TriLevel } from "@/components/results/Facet5TriLevel";
import { DevelopmentAreas } from "@/components/results/DevelopmentAreas";
import { allQuestionsAnswered, computeAssessment } from "@/lib/scoring";
import {
  clearAnswers,
  clearProfileName,
  loadAnswers,
  loadProfileName,
} from "@/lib/storage";
import { useLocale } from "@/lib/locale";
import { identitySpotlightWords } from "@/lib/identitySpotlight";
import { mainFactorLabel, subFacetLabel } from "@/i18n/labels";
import { overallTriCode } from "@/lib/facetTriLevel";
import { PROFILE_BUDDY_COUNT, profileBuddyIndex } from "@/lib/profileBuddy";
import { PixelProfileBuddy } from "@/components/results/PixelProfileBuddy";
import { CompatibleCatCard } from "@/components/results/CompatibleCatCard";
import { IdCardBarcode } from "@/components/results/IdCardBarcode";
import { buildShareSummaryText } from "@/lib/shareSummary";
import type { QuestionsPayload } from "@/types/assessment";

const situationalData = situationalQuestionsData as QuestionsPayload;

export default function ResultsClient() {
  const { locale, m } = useLocale();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pngBusy, setPngBusy] = useState(false);
  const [identityCardNode, setIdentityCardNode] = useState<HTMLDivElement | null>(null);
  const [holderName] = useState(() =>
    typeof window !== "undefined" ? loadProfileName() : "",
  );
  const data = situationalData;

  const result = useMemo(() => {
    const answers = loadAnswers("situational");
    if (!answers || !allQuestionsAnswered(data.questions, answers)) return null;
    return computeAssessment(data, answers);
  }, [data]);

  useEffect(() => {
    if (result) return;
    router.replace("/assessment");
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

  const triCode = useMemo(() => {
    if (!result) return "";
    return overallTriCode(result.factors, locale);
  }, [locale, result]);

  const buddyIndex = useMemo(() => profileBuddyIndex(triCode), [triCode]);
  const buddyName =
    m.results.shareBuddyNames[buddyIndex] ?? m.results.shareBuddyNames[0];
  const compatibleCatEntries = useMemo(() => {
    const names = m.results.shareBuddyNames;
    const indices = [
      (buddyIndex + 1) % PROFILE_BUDDY_COUNT,
      (buddyIndex + 3) % PROFILE_BUDDY_COUNT,
      (buddyIndex + 5) % PROFILE_BUDDY_COUNT,
    ];
    return indices.map((i) => ({
      variant: i,
      label: names[i] ?? names[0],
    }));
  }, [buddyIndex, m.results.shareBuddyNames]);
  const romanceCatEntries = useMemo(() => {
    const names = m.results.shareBuddyNames;
    const indices = [
      (buddyIndex + 2) % PROFILE_BUDDY_COUNT,
      (buddyIndex + 4) % PROFILE_BUDDY_COUNT,
      (buddyIndex + 6) % PROFILE_BUDDY_COUNT,
    ];
    return indices.map((i) => ({
      variant: i,
      label: names[i] ?? names[0],
    }));
  }, [buddyIndex, m.results.shareBuddyNames]);
  const spotlightWords = useMemo(
    () => (result ? identitySpotlightWords(result.factors, locale) : []),
    [locale, result],
  );
  const certifiedDate = useMemo(() => {
    const loc = locale === "th" ? "th-TH" : "en-GB";
    return new Intl.DateTimeFormat(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, [locale]);
  const shareText = useMemo(
    () =>
      result
        ? buildShareSummaryText(result, locale, {
            headline: m.results.shareHeadline,
            modePrefix: m.results.modePrefix,
            modeSituational: m.assessment.modeSituational,
            triCodeLabel: m.triLevel.codeLabel,
            styleSnapshotLabel: m.results.shareStyleSnapshotLabel,
            developmentLabel: m.results.shareDevelopmentLabel,
            privacy: m.results.sharePrivacy,
          })
        : "",
    [locale, m, result],
  );
  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareText]);
  const nativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      await copySummary();
      return;
    }
    try {
      await navigator.share({ title: m.results.shareTitle, text: shareText });
    } catch (e) {
      if ((e as Error).name !== "AbortError") await copySummary();
    }
  }, [copySummary, m.results.shareTitle, shareText]);
  const downloadIdentityCardPng = useCallback(async () => {
    if (!identityCardNode) return;
    setPngBusy(true);
    try {
      const dataUrl = await toPng(identityCardNode, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#e8f4fc",
      });
      const a = document.createElement("a");
      a.download = "facet5-identity-card.png";
      a.href = dataUrl;
      a.click();
    } finally {
      setPngBusy(false);
    }
  }, [identityCardNode]);

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center text-app-muted">
        {m.results.preparing}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 md:gap-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-app-primary">
            {m.results.badge}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {m.results.title}
          </h1>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <LanguageSwitcher
            variant="icon-toggle"
            className="hidden h-auto w-auto rounded-xl border border-app-border bg-app-card/95 px-2 py-1.5 md:inline-flex lg:hidden"
          />
          <ReviewAssessmentLink className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-app-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-app-elevated sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            {m.results.review}
          </ReviewAssessmentLink>
          <button
            type="button"
            onClick={() => {
              clearAnswers("situational");
              clearProfileName();
              router.push("/");
            }}
            className="w-full rounded-2xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {m.results.startOver}
          </button>
        </div>
      </header>

      <div
        ref={setIdentityCardNode}
        className="mx-auto w-full max-w-[min(100%,38.4rem)] px-1 pb-6 pt-1 sm:pb-8"
      >
        <section
          className="overflow-hidden rounded-2xl border border-[#8eb8d8] bg-[#e8f4fc] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(12,35,64,0.06),0_2px_4px_rgba(12,35,64,0.08),0_8px_16px_-4px_rgba(12,35,64,0.18),0_20px_40px_-12px_rgba(12,35,64,0.28)] ring-1 ring-white/80 dark:border-[#8eb8d8] dark:bg-[#e8f4fc]! dark:ring-white/40 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_-8px_rgba(0,0,0,0.55),0_24px_48px_-12px_rgba(0,0,0,0.45)]"
          style={{
            backgroundImage: `
            linear-gradient(125deg, rgba(255,255,255,0.5) 0%, transparent 45%),
            linear-gradient(-35deg, rgba(180,210,235,0.35) 0%, transparent 50%)
          `,
          }}
        >
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6 md:gap-8">
          <div className="flex w-full shrink-0 flex-col items-center sm:w-[min(100%,13.75rem)] sm:max-w-none">
            <div className="relative aspect-square w-full max-w-[min(100%,13.75rem)] overflow-hidden rounded border-2 border-[#b8cfe0] shadow-[inset_0_2px_8px_rgba(12,35,64,0.1),0_4px_12px_-2px_rgba(12,35,64,0.18),0_1px_0_rgba(255,255,255,0.9)_inset] sm:max-w-none">
              <PixelProfileBuddy
                triSignature={triCode}
                variant={buddyIndex}
                label={buddyName}
                fit="fill"
                fillObjectFit="cover"
              />
            </div>
            <p className="mt-3 text-center font-mono text-sm font-bold leading-tight tracking-widest text-[#0c2340] sm:text-base">
              {triCode}
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-left text-2xl font-black uppercase tracking-[0.12em] text-[#0c2340] sm:text-right sm:text-3xl">
                {m.results.idCardVisualTitle}
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="border-b-2 border-[#0c2340] pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#3d5a73]">
                  {m.results.nameField}
                </p>
                <p className="truncate text-base font-semibold text-[#0c2340]">
                  {holderName.trim() ? holderName.trim() : m.results.nameUnspecified}
                </p>
              </div>
              <div className="border-b-2 border-[#0c2340] pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#3d5a73]">
                  {m.results.catTypeField}
                </p>
                <p className="text-base font-semibold text-[#0c2340]">
                  {buddyName}
                </p>
              </div>
              <div className="border-b-2 border-[#0c2340] pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#3d5a73]">
                  {m.results.spotlightField}
                </p>
                <p className="text-sm font-medium leading-snug text-[#0c2340]">
                  {spotlightWords.join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#0c2340] pb-1.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#3d5a73]">
                    {m.results.certifiedField}
                  </p>
                  <p className="text-sm font-semibold text-[#0c2340]">
                    {certifiedDate}
                  </p>
                </div>
                <IdCardBarcode seed={triCode} />
              </div>
            </div>

          </div>
        </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="w-full rounded-2xl border-2 border-app-border bg-app-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-app-elevated sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {showMore ? m.results.showLessDetails : m.results.showMoreDetails}
        </button>
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => void nativeShare()}
            className="w-full rounded-2xl bg-app-primary px-5 py-2.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {copied ? m.results.shareCopied : m.results.shareTitle}
          </button>
          <button
            type="button"
            disabled={pngBusy}
            onClick={() => void downloadIdentityCardPng()}
            className="w-full rounded-2xl border-2 border-app-primary/40 bg-app-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-app-primary-soft/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {pngBusy ? m.results.shareDownloadPngWorking : m.results.shareDownloadPng}
          </button>
        </div>
      </div>

      {showMore ? (
        <>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-emerald-200/85 bg-linear-to-br from-emerald-50 via-white to-teal-50/60 shadow-[0_14px_40px_-20px_rgba(6,78,59,0.35)] ring-1 ring-emerald-100/60 dark:border-emerald-800/50 dark:from-emerald-950/50 dark:via-app-card dark:to-emerald-950/30 dark:ring-emerald-900/30">
          <div className="border-b border-emerald-200/55 bg-emerald-500/7 px-5 py-4 dark:border-emerald-800/40 dark:bg-emerald-500/4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-11 w-1 shrink-0 rounded-full bg-linear-to-b from-emerald-500 to-teal-600 shadow-[0_0_14px_-2px_rgba(13,148,136,0.6)] dark:from-emerald-400 dark:to-teal-500" aria-hidden />
              <h3 className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-emerald-900 dark:text-emerald-200 sm:text-xs">
                <span>{m.results.compatibleCatsLabel}</span>
                <span
                  aria-hidden
                  className="text-[0.8rem] leading-none sm:text-[0.9rem]"
                >
                  🤝
                </span>
              </h3>
            </div>
          </div>
          <div className="p-4 sm:p-5 md:p-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {compatibleCatEntries.map(({ variant: v, label }) => (
                <CompatibleCatCard
                  key={v}
                  accent="emerald"
                  triSignature={triCode}
                  variant={v}
                  label={label}
                />
              ))}
            </ul>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-rose-200/85 bg-linear-to-br from-rose-50 via-white to-fuchsia-50/55 shadow-[0_14px_40px_-20px_rgba(190,24,93,0.28)] ring-1 ring-rose-100/60 dark:border-rose-800/45 dark:from-rose-950/45 dark:via-app-card dark:to-rose-950/25 dark:ring-rose-900/30">
          <div className="border-b border-rose-200/55 bg-rose-500/6 px-5 py-4 dark:border-rose-800/40 dark:bg-rose-500/4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-11 w-1 shrink-0 rounded-full bg-linear-to-b from-rose-500 to-pink-600 shadow-[0_0_14px_-2px_rgba(225,29,72,0.45)] dark:from-rose-400 dark:to-pink-500" aria-hidden />
              <h3 className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-rose-900 dark:text-rose-200 sm:text-xs">
                <span>{m.results.compatibleLoveCatsLabel}</span>
                <span
                  aria-hidden
                  className="text-[0.8rem] leading-none sm:text-[0.9rem]"
                >
                  ❤
                </span>
              </h3>
            </div>
          </div>
          <div className="p-4 sm:p-5 md:p-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {romanceCatEntries.map(({ variant: v, label }) => (
                <CompatibleCatCard
                  key={`romance-${v}`}
                  accent="rose"
                  triSignature={triCode}
                  variant={v}
                  label={label}
                />
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">{m.results.chartFocusLabel}</h2>
        </div>
        <RadarCharts mainFacets={mainPoints} subFacets={subPoints} view="both" />
      </section>

      <Facet5TriLevel factors={result.factors} />

      <DevelopmentAreas subFacets={result.subFacets} />
        </>
      ) : null}
    </div>
  );
}
