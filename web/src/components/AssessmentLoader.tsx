"use client";

import dynamic from "next/dynamic";

const AssessmentClient = dynamic(() => import("@/components/AssessmentClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center text-app-muted">
      Loading questionnaire…
    </div>
  ),
});

export default function AssessmentLoader() {
  return <AssessmentClient />;
}
