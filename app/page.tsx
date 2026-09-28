import { Playfair_Display } from "next/font/google";

import { HeroCarousel } from "@/components/hero-carousel";
import { UpcomingSection, type UpcomingPost } from "@/components/upcoming-section";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import { LOCAL_PREVIEW_POSTS } from "@/lib/local-preview-posts";
import { getLocalizedPostFields } from "@/lib/post-i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

const EXCLUDED_UPCOMING_CARD_PATHS = ["/projekte/alumni", "/projekte/bashkpunimet"] as const;
const LOCAL_SPORT_EVENTS = [
  ["Futboll", "2026-10-05T20:00:00+02:00"],
  ["Volejboll", "2026-10-12T20:00:00+02:00"],
  ["Futboll", "2026-10-19T20:00:00+02:00"],
  ["Volejboll", "2026-10-26T20:00:00+01:00"],
  ["Futboll", "2026-11-02T20:00:00+01:00"],
  ["Volejboll", "2026-11-09T20:00:00+01:00"],
  ["Futboll", "2026-11-16T20:00:00+01:00"],
  ["Volejboll", "2026-11-23T20:00:00+01:00"],
  ["Futboll", "2026-11-30T20:00:00+01:00"],
  ["Volejboll", "2026-12-07T20:00:00+01:00"],
  ["Futboll", "2026-12-14T20:00:00+01:00"],
] as const;

const LOCAL_SPORT_POSTS: UpcomingPost[] = LOCAL_SPORT_EVENTS.map(([title, eventAt], index) => ({
  id: -(index + 1),
  title,
  imageMimeType: "image/jpeg",
  eventAt: new Date(eventAt),
  venue: "Messehalle 9, Thurgauerstrasse 11, 8050 Zürich",
  cardLinkPath: "/projekte/sporti",
  coverSrc: title === "Futboll" ? "/media/Futboll.jpg" : "/media/Vollejboll.jpg",
  detailHref: "/projekte/sporti",
}));

const LOCAL_KAFE_LLAFE_EVENTS = [
  ["2026-09-30T18:30:00+02:00", "/media/kafe-llafe-post-1.png"],
  ["2026-10-14T18:30:00+02:00", "/media/kafe-llafe-post-2.png"],
  ["2026-10-28T18:30:00+01:00", "/media/kafe-llafe-post-3.png"],
  ["2026-11-11T18:30:00+01:00", "/media/kafe-llafe-post-4.png"],
  ["2026-11-25T18:30:00+01:00", "/media/kafe-llafe-post-5.png"],
  ["2026-12-09T18:30:00+01:00", "/media/kafe-llafe-post-6.png"],
] as const;

const LOCAL_KAFE_LLAFE_POSTS: UpcomingPost[] = LOCAL_KAFE_LLAFE_EVENTS.map(
  ([eventAt, coverSrc], index) => ({
    id: -(100 + index),
    title: "Kafe Llafe",
    imageMimeType: "image/png",
    eventAt: new Date(eventAt),
    venue: "bQm Kulturcafé & Bar, Leonhardstrasse 34, 8092 Zürich",
    cardLinkPath: "/evente/kafe-llafe",
    coverSrc,
    detailHref: "/evente/kafe-llafe",
  }),
);

const LOCAL_VARGJET_E_LIRA_EVENTS = [
  "2026-10-07T12:00:00+02:00",
  "2026-11-04T12:00:00+01:00",
  "2026-12-02T12:00:00+01:00",
] as const;

const LOCAL_VARGJET_E_LIRA_POSTS: UpcomingPost[] = LOCAL_VARGJET_E_LIRA_EVENTS.map(
  (eventAt, index) => ({
    id: -(200 + index),
    title: "Vargjet e Lira",
    imageMimeType: "image/jpeg",
    eventAt: new Date(index === 0 ? "2026-10-07T18:30:00+02:00" : eventAt),
    venue: index === 0 ? "Rämistrasse 71, 8006 Zürich, KOL-H-309 EV" : null,
    cardLinkPath: "/projekte/kultura/vargjet-e-lira",
    coverSrc: "/media/vargjet.jpeg",
    detailHref: "/projekte/kultura/vargjet-e-lira",
    showTime: index === 0 ? undefined : false,
    showVenue: index === 0 ? undefined : false,
  }),
);

const LOCAL_ADDITIONAL_POSTS: UpcomingPost[] = [
  {
    id: -400,
    title: "25 Vjetori",
    imageMimeType: "image/png",
    eventAt: new Date("2026-10-17T12:00:00+02:00"),
    venue: "Glattalstrasse 201, 8153 Rümlang",
    cardLinkPath: null,
    coverSrc: "/media/image-2-2.png",
    showTime: false,
    showVenue: true,
    clickable: false,
  },
  {
    id: -401,
    title: "Diskutim në panel",
    imageMimeType: "image/png",
    eventAt: new Date("2026-11-12T12:00:00+01:00"),
    venue: null,
    cardLinkPath: "/evente/ligjerata",
    coverSrc: "/media/image-2-2.png",
    detailHref: "/evente/ligjerata",
    dateLabel: "12. November 2026",
    dateIcon: "📅",
    showTime: false,
    showVenue: false,
  },
  {
    id: -402,
    title: "Festa e Flamurit",
    imageMimeType: "image/png",
    eventAt: new Date("2026-11-28T12:00:00+01:00"),
    venue: "Aubrey, Schiffbaustrasse 10, 8005 Zürich",
    cardLinkPath: "/evente/festa-e-flamurit",
    coverSrc: "/media/image-2-2.png",
    detailHref: "/evente/festa-e-flamurit",
    showTime: false,
    showVenue: true,
  },
];

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const start = startOfLocalDay(new Date());

  let upcomingRows: {
    id: number;
    title: string;
    content: string;
    i18nKey: string | null;
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
        content: true,
        i18nKey: true,
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
            title: getLocalizedPostFields(dict, p).title,
            imageMimeType: p.imageMimeType,
            eventAt: p.eventAt,
            venue: p.venue,
            cardLinkPath: p.cardLinkPath,
            coverSrc:
              p.i18nKey === "activityFair2026" ? "/evente/acivityfair_post.JPG" : undefined,
          },
        ]
      : []
  );

  const upcomingWithKafe = [
    ...upcomingPosts,
    ...LOCAL_SPORT_POSTS,
    ...LOCAL_KAFE_LLAFE_POSTS,
    ...LOCAL_VARGJET_E_LIRA_POSTS,
    ...LOCAL_PREVIEW_POSTS,
    ...LOCAL_ADDITIONAL_POSTS,
  ].sort((a, b) => a.eventAt.getTime() - b.eventAt.getTime());

  return (
    <main className="w-full bg-white text-black">
      <section className="w-full">
        <HeroCarousel headingFontClassName={`${playfair.className} font-semibold`} />
      </section>

      <UpcomingSection
        headingClassName={playfair.className}
        posts={upcomingWithKafe}
        dict={dict}
        locale={locale}
      />
    </main>
  );
}
