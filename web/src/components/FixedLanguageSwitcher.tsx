"use client";

import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function FixedLanguageSwitcher() {
  const pathname = usePathname();
  const isAssessment = pathname === "/assessment";
  const isResults = pathname === "/results";

  return (
    <div
      className={[
        "pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-6",
        isAssessment ? "hidden lg:block" : "",
        isResults ? "md:hidden lg:block" : "",
      ].join(" ")}
    >
      <div className="pointer-events-auto">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
