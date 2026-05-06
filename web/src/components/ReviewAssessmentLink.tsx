"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function ReviewAssessmentLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href="/assessment" className={className}>
      {children}
    </Link>
  );
}
