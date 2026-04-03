"use client";

import dynamic from "next/dynamic";

const ResultsClient = dynamic(() => import("@/components/ResultsClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center text-slate-600">
      Loading results…
    </div>
  ),
});

export default function ResultsLoader() {
  return <ResultsClient />;
}
