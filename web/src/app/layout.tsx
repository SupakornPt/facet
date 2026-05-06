import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { FixedLanguageSwitcher } from "@/components/FixedLanguageSwitcher";
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
        className={`${dmSans.className} text-foreground flex min-h-full flex-col`}
      >
        <Providers>
          <SkipToContent />
          <FixedLanguageSwitcher />
          <div className="flex flex-1 flex-col" id="main">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
