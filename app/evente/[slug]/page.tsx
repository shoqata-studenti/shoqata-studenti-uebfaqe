import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { EventGalleryZigzag } from "@/components/event-gallery-zigzag";
import { PostCoverMedia } from "@/components/post-cover-media";
import { editionYearsForEventHub, type EventEditionYear } from "@/lib/event-editions";
import { rowsToGalleryBlocks } from "@/lib/event-gallery-blocks";
import { festaFlamuritHubCardFirstVideoSrc } from "@/lib/festa-flamurit-static-gallery";
import { kafeLlafeStaticGalleryBlocks } from "@/lib/kafe-llafe-static-gallery";
import { getEventPageMeta } from "@/lib/evente-page-meta";
import { fetchSofra2026HomepagePostVideo, type SofraHomePostCover } from "@/lib/sofra-2026-home-post-video";
import { udhetimeHubCardPosterSrc } from "@/lib/udhetime-static-gallery";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

const SINGLE_PAGE_EVENT_SLUG = "kafe-llafe" as const;
const FESTA_FLAMURIT_SLUG = "festa-e-flamurit" as const;

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
    kafeGalleryBlocks = [...kafeLlafeStaticGalleryBlocks(meta.slug), ...kafeGalleryBlocks];
  }

  let sofra2026VideoPost: SofraHomePostCover | null = null;
  if (meta.slug === "sofra") {
    sofra2026VideoPost = await fetchSofra2026HomepagePostVideo();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{ev.badge}</p>
        <h1
          className={cn(
            playfair.className,
            "mt-3 tracking-tight text-black",
            meta.slug === FESTA_FLAMURIT_SLUG
              ? "text-3xl font-medium md:text-[2.125rem]"
              : "text-3xl font-bold md:text-4xl"
          )}
        >
          {interpolate(ev.title, { name: meta.name })}
        </h1>
        {(() => {
          const isKafe = meta.slug === SINGLE_PAGE_EVENT_SLUG;
          const isFesta = meta.slug === FESTA_FLAMURIT_SLUG;
          const introMultiline = isKafe || isFesta;
          const introText = isFesta
            ? ev.festaFlamuritBody
            : interpolate(ev.intro, { description: meta.description });
          return (
            <p
              className={cn(
                "mt-4 text-black/70 md:text-[15px]",
                introMultiline
                  ? "max-w-prose whitespace-pre-line text-[15px] leading-[1.75] md:text-base md:leading-[1.7]"
                  : "max-w-2xl text-sm leading-relaxed md:text-base"
              )}
            >
              {introText}
            </p>
          );
        })()}

        {meta.slug === SINGLE_PAGE_EVENT_SLUG ? (
          <EventGalleryZigzag blocks={kafeGalleryBlocks} />
        ) : (
          <>
            <h2 className="mt-14 text-sm font-bold uppercase tracking-[0.12em] text-black/70">
              {ev.editionYearsHeading}
            </h2>
            <ul className="mt-6 grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
              {editionYearsForEventHub(meta.slug).map((year) => {
                const udhetimeSubtitle =
                  meta.slug === "udhetime" ? udhetimeYearCardSubtitle(ev, year).trim() : "";
                const cardCaption = udhetimeSubtitle || meta.name;
                const festaHubVideoSrc = festaFlamuritHubCardFirstVideoSrc(meta.slug, year);
                const udhetimePosterSrc = udhetimeHubCardPosterSrc(meta.slug, year);
                const hubStaticCoverSrc = festaHubVideoSrc ?? udhetimePosterSrc;
                const hubStaticCoverMime: "video/mp4" | "image/png" | null = festaHubVideoSrc
                  ? "video/mp4"
                  : udhetimePosterSrc
                    ? "image/png"
                    : null;
                const editionCardTitle = interpolate(ev.editionTitle, {
                  name: meta.name,
                  year: String(year),
                });
                const mediaTopCardClass =
                  "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-sm border border-black/12 bg-white text-center shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md";
                const mediaTopFooterClass =
                  "mt-auto flex min-h-[120px] flex-col items-center justify-center px-5 pb-8 pt-5";

                const sofraCardVideo =
                  meta.slug === "sofra" && year === 2026 && sofra2026VideoPost ? sofra2026VideoPost : null;

                return (
                  <li key={year} className="flex h-full min-h-0">
                    {sofraCardVideo ? (
                      <Link href={`/evente/${meta.slug}/${year}`} className={mediaTopCardClass}>
                        <div className="w-full shrink-0">
                          <PostCoverMedia
                            postId={sofraCardVideo.postId}
                            title={editionCardTitle}
                            mimeType={sofraCardVideo.imageMimeType}
                            layout="upcoming"
                          />
                        </div>
                        <div className={mediaTopFooterClass}>
                          <span
                            className={`${playfair.className} text-3xl font-bold tabular-nums text-black md:text-4xl`}
                          >
                            {year}
                          </span>
                          <span className="mt-2 text-sm font-semibold text-black/70">{cardCaption}</span>
                        </div>
                      </Link>
                    ) : hubStaticCoverSrc && hubStaticCoverMime ? (
                      <Link href={`/evente/${meta.slug}/${year}`} className={mediaTopCardClass}>
                        <div className="w-full shrink-0">
                          <PostCoverMedia
                            postId={0}
                            title={editionCardTitle}
                            mimeType={hubStaticCoverMime}
                            layout="upcoming"
                            coverSrc={hubStaticCoverSrc}
                          />
                        </div>
                        <div className={mediaTopFooterClass}>
                          <span
                            className={`${playfair.className} text-3xl font-bold tabular-nums text-black md:text-4xl`}
                          >
                            {year}
                          </span>
                          <span className="mt-2 text-sm font-semibold text-black/70">{cardCaption}</span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={`/evente/${meta.slug}/${year}`}
                        className="flex min-h-[140px] w-full flex-col items-center justify-center rounded-sm border border-black/12 bg-white px-6 py-10 text-center shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md"
                      >
                        <span
                          className={`${playfair.className} text-3xl font-bold tabular-nums text-black md:text-4xl`}
                        >
                          {year}
                        </span>
                        <span className="mt-2 text-sm font-semibold text-black/70">{cardCaption}</span>
                      </Link>
                    )}
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
