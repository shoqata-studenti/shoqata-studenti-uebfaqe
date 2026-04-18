import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { HeaderNav } from "@/components/header-nav";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairNav.variable} h-full antialiased`}
    >
      <body className={`${geistSans.className} min-h-full flex flex-col`}>
        <header className="w-full border-t border-black/15 border-b border-black/10 bg-white">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-4 md:px-10">
            <Link href="/" className="flex min-h-14 shrink-0 items-center gap-4">
              <Image
                src="/logo-shoqata.png"
                alt="Shoqata Studenti Zürich"
                width={64}
                height={64}
                className="size-14 shrink-0 object-contain md:size-16"
                priority
              />
              <div className="flex flex-col justify-center leading-tight text-black">
                <span className="text-sm font-bold uppercase tracking-wide md:text-base">
                  SHOQATA
                </span>
                <span className="text-sm font-bold uppercase tracking-wide md:text-base">
                  STUDENTI
                </span>
                <span className="mt-0.5 text-xs font-normal uppercase tracking-[0.2em] text-black/80 md:text-sm">
                  ZÜRICH
                </span>
              </div>
            </Link>

            <HeaderNav navFontClassName={playfairNav.className} />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
