"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { AssessmentResult } from "@/types/assessment";
import { buildShareSummaryText } from "@/lib/shareSummary";
import { useLocale } from "@/lib/locale";
import { ResultShareCard } from "@/components/results/ResultShareCard";

interface ShareSummaryProps {
  result: AssessmentResult;
}

export function ShareSummary({ result }: ShareSummaryProps) {
  const { locale, m } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [pngBusy, setPngBusy] = useState(false);

  const text = buildShareSummaryText(result, locale, {
    headline: m.results.shareHeadline,
    modePrefix: m.results.modePrefix,
    modeSituational: m.assessment.modeSituational,
    triCodeLabel: m.triLevel.codeLabel,
    styleSnapshotLabel: m.results.shareStyleSnapshotLabel,
    developmentLabel: m.results.shareDevelopmentLabel,
    privacy: m.results.sharePrivacy,
  });

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const share = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({
        title: m.results.shareTitle,
        text,
      });
    } catch (e) {
      if ((e as Error).name !== "AbortError") await copy();
    }
  }, [copy, m.results.shareTitle, text]);

  const downloadPng = useCallback(async () => {
    const node = cardRef.current;
    if (!node) return;
    setPngBusy(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.download = "facet5-profile-summary.png";
      a.href = dataUrl;
      a.click();
    } finally {
      setPngBusy(false);
    }
  }, []);

  return (
    <section className="rounded-3xl border border-app-border bg-app-primary-soft/25 p-6 shadow-[var(--app-shadow)] sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        {m.results.shareTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-app-muted">
        {m.results.shareBlurb}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-2xl border-2 border-app-border bg-app-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-app-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? m.results.shareCopied : m.results.shareCopy}
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className="rounded-2xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {m.results.shareNative}
        </button>
        <button
          type="button"
          disabled={pngBusy}
          onClick={() => void downloadPng()}
          className="rounded-2xl border-2 border-app-primary/35 bg-app-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-app-primary-soft/40 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {pngBusy ? m.results.shareDownloadPngWorking : m.results.shareDownloadPng}
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-app-border bg-app-elevated p-4">
        <p className="mb-3 text-xs font-medium text-app-subtle">
          {m.results.shareCardCaption}
        </p>
        <ResultShareCard ref={cardRef} result={result} />
      </div>
    </section>
  );
}
