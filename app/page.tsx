import { Playfair_Display } from "next/font/google";

import { HeroCarousel } from "@/components/hero-carousel";
import { UpcomingSection } from "@/components/upcoming-section";
import { prisma } from "@/lib/db";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

const EXCLUDED_UPCOMING_CARD_PATHS = ["/projekte/alumni", "/projekte/bashkpunimet"] as const;

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dateLocale = dateLocaleFor(locale);
  const start = startOfLocalDay(new Date());

  let upcomingRows: {
    id: number;
    title: string;
    imageMimeType: string;
    eventAt: Date | null;
    venue: string | null;
    cardLinkPath: string | null;
  }[] = [];

  try {
    upcomingRows = await prisma.post.findMany({
      where: {
        AND: [
          { eventAt: { not: null } },
          { eventAt: { gte: start } },
          {
            OR: [
              { cardLinkPath: null },
              { cardLinkPath: { notIn: [...EXCLUDED_UPCOMING_CARD_PATHS] } },
            ],
          },
        ],
      },
      orderBy: { eventAt: "asc" },
      take: 24,
      select: {
        id: true,
        title: true,
        imageMimeType: true,
        eventAt: true,
        venue: true,
        cardLinkPath: true,
      },
    });
  } catch {
    upcomingRows = [];
  }

  const upcomingPosts = upcomingRows.flatMap((p) =>
    p.eventAt
      ? [
          {
            id: p.id,
            title: p.title,
            imageMimeType: p.imageMimeType,
            eventAt: p.eventAt,
            venue: p.venue,
            cardLinkPath: p.cardLinkPath,
          },
        ]
      : []
  );

  return (
    <main className="w-full bg-white text-black">
      <section className="w-full">
        <HeroCarousel headingFontClassName={`${playfair.className} font-semibold`} />
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <h2
          className={`${playfair.className} text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {dict.home.aboutTitle}
        </h2>
      </section>

      <UpcomingSection
        headingClassName={playfair.className}
        posts={upcomingPosts}
        dict={dict}
        dateLocale={dateLocale}
      />
    </main>
  );
}
