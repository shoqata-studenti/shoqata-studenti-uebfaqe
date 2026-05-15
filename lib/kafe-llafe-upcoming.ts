import "server-only";

import type { UpcomingPost } from "@/components/upcoming-section";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/** ID unik për kartën e veçuar (nuk përputhet me `Post` në DB). */
const KAFE_LLafe_FEATURED_ID = 9_001_000;

/** 27 maj 2026, 18:30 (CEST) — bQm Kulturcafé & Bar; kopertinë nga `/public/evente/kafe-llafe-poster.png`. */
export function buildKafeLlafeUpcomingCard(dict: Dictionary): UpcomingPost {
  return {
    id: KAFE_LLafe_FEATURED_ID,
    title: dict.nav.kafeLlafe,
    imageMimeType: "image/png",
    eventAt: new Date(Date.UTC(2026, 4, 27, 16, 30, 0)),
    venue: "bQm Kulturcafé & Bar, Leonhardstrasse 34, Zürich",
    cardLinkPath: "/evente/kafe-llafe",
    coverSrc: "/evente/kafe-llafe-poster.png",
    detailHref: "/evente/kafe-llafe",
  };
}

export function mergeKafeLlafeIntoUpcoming(posts: UpcomingPost[], kafe: UpcomingPost): UpcomingPost[] {
  const withoutDup = posts.filter((p) => p.cardLinkPath !== "/evente/kafe-llafe");
  return [...withoutDup, kafe].sort((a, b) => a.eventAt.getTime() - b.eventAt.getTime());
}
