"use client";

import { useLocale } from "@/lib/locale";

const beginAssessmentPrimaryClass =
  "inline-flex w-full items-center justify-center rounded-2xl bg-app-primary px-6 py-3.5 text-sm font-semibold text-app-on-primary shadow-md transition hover:bg-app-primary-hover sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Submit control for a form that navigates to `/assessment` (Enter in associated fields activates it). */
export function BeginAssessmentSubmitButton() {
  const { m } = useLocale();
  return (
    <button type="submit" className={beginAssessmentPrimaryClass}>
      {m.home.begin}
    </button>
  );
}
