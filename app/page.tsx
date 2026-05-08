import { Playfair_Display } from "next/font/google";

import { EventCards } from "@/components/event-cards";
import { HeroCarousel } from "@/components/hero-carousel";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import { EVENT_SLUGS } from "@/lib/event-slugs";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

/** Lajmet lexohen nga DB në kërkesë, jo gjatë build-it statik. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const eventItems = [
    { slug: "kafe-llafe" as const, name: dict.nav.kafeLlafe },
    { slug: "festa-e-flamurit" as const, name: dict.nav.festaEFlamurit },
    { slug: "udhetime" as const, name: dict.nav.udhetime },
    { slug: "ligjerata" as const, name: dict.nav.ligjerata },
    { slug: "sofra" as const, name: dict.nav.sofra },
  ];

  let coverBySlug: Record<string, number | null> = {};
  try {
    const covers = await Promise.all(
      EVENT_SLUGS.map(async (slug) => {
        const first = await prisma.eventGalleryImage.findFirst({
          where: { eventSlug: slug },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: { id: true },
        });
        return [slug, first?.id ?? null] as const;
      })
    );
    coverBySlug = Object.fromEntries(covers);
  } catch {
    coverBySlug = Object.fromEntries(EVENT_SLUGS.map((s) => [s, null]));
  }

  const events = eventItems.map((e) => ({
    slug: e.slug,
    name: e.name,
    coverImageId: coverBySlug[e.slug] ?? null,
  }));

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

      <EventCards
        headingClassName={playfair.className}
        heading={dict.home.eventsHeading}
        subheading={dict.home.eventsSubheading}
        events={events}
      />
    </main>
  );
}
