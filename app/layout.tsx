import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
  const navItems = [
    { label: "HOME", href: "/" },
    { label: "RRETH NESH", href: "/history" },
    { label: "STUDIMET", href: "#" },
    { label: "EVENTE", href: "#" },
    { label: "PROJEKTE", href: "#" },
    { label: "FEDERATA", href: "#" },
    { label: "KONTAKT", href: "#" },
    { label: "REGJISTROHU", href: "/membership" },
  ];

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

            <nav
              className={`${playfairNav.className} ml-auto flex max-w-[calc(100%-12rem)] flex-wrap items-center justify-end gap-x-5 gap-y-2 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-black md:max-w-none md:gap-x-6 md:text-xs lg:text-sm`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-[#E11D48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
