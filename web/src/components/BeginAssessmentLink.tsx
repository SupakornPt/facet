"use client";

import Link from "next/link";
import { clearAnswers } from "@/lib/storage";
import { useLocale } from "@/lib/locale";

export function BeginAssessmentLink() {
  const { m } = useLocale();
  return (
    <Link
      href="/assessment"
      onClick={() => clearAnswers()}
      className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-sky-500 hover:to-blue-600"
    >
      {m.home.begin}
    </Link>
  );
}
