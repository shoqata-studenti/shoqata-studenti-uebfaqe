import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { EventGalleryZigzag } from "@/components/event-gallery-zigzag";
import { EVENT_EDITION_YEARS, type EventEditionYear } from "@/lib/event-editions";
import { rowsToGalleryBlocks } from "@/lib/event-gallery-blocks";
import { getEventPageMeta } from "@/lib/evente-page-meta";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";

const SINGLE_PAGE_EVENT_SLUG = "kafe-llafe" as const;

function udhetimeYearCardSubtitle(ev: Dictionary["evente"], year: EventEditionYear): string {
  switch (year) {
    case 2026:
      return ev.udhetimeEditionSubtitle2026;
    case 2025:
      return ev.udhetimeEditionSubtitle2025;
    case 2024:
      return ev.udhetimeEditionSubtitle2024;
    default:
      return "";
  }
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EventeHubPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ev = dict.evente;

  const meta = getEventPageMeta(dict, locale, slug);
  if (!meta) notFound();

  let kafeGalleryBlocks = rowsToGalleryBlocks([]);
  if (meta.slug === SINGLE_PAGE_EVENT_SLUG) {
    try {
      const rows = await prisma.eventGalleryImage.findMany({
        where: { eventSlug: meta.slug },
        orderBy: [
          { editionYear: "desc" },
          { sortOrder: "asc" },
          { slideshowIndex: "asc" },
          { id: "asc" },
        ],
        select: {
          id: true,
          mimeType: true,
          editionYear: true,
          sortOrder: true,
          slideshowGroupId: true,
          slideshowIndex: true,
        },
      });
      kafeGalleryBlocks = rowsToGalleryBlocks(rows);
    } catch {
      kafeGalleryBlocks = rowsToGalleryBlocks([]);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{ev.badge}</p>
        <h1
          className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {interpolate(ev.title, { name: meta.name })}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
          {interpolate(ev.intro, { description: meta.description })}
        </p>

        {meta.slug === SINGLE_PAGE_EVENT_SLUG ? (
          <EventGalleryZigzag
            blocks={kafeGalleryBlocks}
            momentsTitle={ev.momentsTitle}
            emptyMessage={ev.emptyGallery}
          />
        ) : (
          <>
            <h2 className="mt-14 text-sm font-bold uppercase tracking-[0.12em] text-black/70">
              {ev.editionYearsHeading}
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {EVENT_EDITION_YEARS.map((year) => {
                const udhetimeSubtitle =
                  meta.slug === "udhetime" ? udhetimeYearCardSubtitle(ev, year).trim() : "";
                const cardCaption = udhetimeSubtitle || meta.name;
                return (
                  <li key={year}>
                    <Link
                      href={`/evente/${meta.slug}/${year}`}
                      className="flex min-h-[140px] flex-col items-center justify-center rounded-sm border border-black/12 bg-white px-6 py-10 text-center shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md"
                    >
                      <span
                        className={`${playfair.className} text-3xl font-bold tabular-nums text-black md:text-4xl`}
                      >
                        {year}
                      </span>
                      <span className="mt-2 text-sm font-semibold text-black/70">{cardCaption}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
