"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function ReviewAssessmentLink({
  className,
  children,
  focusQuestionId,
}: {
  className?: string;
  children: ReactNode;
  /** When set, opens the assessment on the page that contains this question (see `?focus=`). */
  focusQuestionId?: number;
}) {
  const href =
    focusQuestionId !== undefined
      ? `/assessment?focus=${focusQuestionId}`
      : "/assessment";
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
