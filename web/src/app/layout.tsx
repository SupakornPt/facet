import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SkipToContent } from "@/components/SkipToContent";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: "Facet 5",
  description:
    "Multi-step personality questionnaire with facet scoring and radar results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body
        className={`${dmSans.className} min-h-full flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-slate-50 to-slate-100 text-slate-900`}
      >
        <Providers>
          <SkipToContent />
          <div className="pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
            <div className="pointer-events-auto">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex flex-1 flex-col" id="main">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
