import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";

import { HeaderNav } from "@/components/header-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary, htmlLangFor } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairNav = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair-nav",
});

export const metadata: Metadata = {
  title: "Shoqata Studenti Zürich",
  description: "Platforma zyrtare e Shoqata Studenti Zürich.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html
      lang={htmlLangFor(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${playfairNav.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} flex min-h-full flex-col`}>
        <LocaleProvider locale={locale} dict={dict}>
          <div className="flex w-full flex-1 flex-col">
            <header className="w-full border-t border-black/15 border-b border-black/10 bg-white">
              <div className="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-6 py-3 md:gap-3 md:px-10 md:py-4">
                <Link href="/" className="flex min-h-14 shrink-0 items-center gap-3 md:gap-4">
                  <img
                    src="/logo-shoqata.png"
                    alt={dict.layout.logoAlt}
                    width={64}
                    height={64}
                    className="size-14 shrink-0 object-contain md:size-16"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="flex flex-col justify-center leading-tight text-black">
                    <span className="text-sm font-bold uppercase tracking-wide md:text-base">
                      {dict.layout.line1}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wide md:text-base">
                      {dict.layout.line2}
                    </span>
                    <span className="mt-0.5 text-xs font-normal uppercase tracking-[0.2em] text-black/80 md:text-sm">
                      {dict.layout.line3}
                    </span>
                  </div>
                </Link>

                <HeaderNav navFontClassName={playfairNav.className} />

                <div className="ml-2 shrink-0 md:ml-3">
                  <LanguageSwitcher />
                </div>
              </div>
            </header>

            <div className="flex-1">{children}</div>

            <SiteFooter footer={dict.layout.footer} />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
