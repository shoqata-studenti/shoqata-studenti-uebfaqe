import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { textExcerpt } from "@/lib/excerpt";
import { prisma } from "@/lib/db";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";
import { postCardHref } from "@/lib/post-card-links";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ year: string }>;
};

export default async function EventeYearPage({ params }: Props) {
  const { year: slug } = await params;

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ev = dict.evente;
  const dateLocale = dateLocaleFor(locale);

  const eventMap = {
    "kafe-llafe": {
      name: dict.nav.kafeLlafe,
      description:
        locale === "de"
          ? "Treffen und offener Austausch für Studierende in entspannter Atmosphäre."
          : locale === "en"
            ? "Meetups and open conversations for students in a relaxed atmosphere."
            : "Takime dhe biseda të hapura për studentë në një atmosferë të lirshme.",
    },
    "festa-e-flamurit": {
      name: dict.nav.festaEFlamurit,
      description:
        locale === "de"
          ? "Gemeinsame Feier mit Musik, Programm und Gemeinschaft rund um den 28. November."
          : locale === "en"
            ? "Community celebration with music, program, and activities around November 28."
            : "Festë e përbashkët me muzikë, program dhe aktivitete rreth 28 Nëntorit.",
    },
    udhetime: {
      name: dict.nav.udhetime,
      description:
        locale === "de"
          ? "Ausflüge in der Schweiz für Vernetzung, Freizeit und neue Erlebnisse."
          : locale === "en"
            ? "Trips around Switzerland for networking, leisure, and new experiences."
            : "Udhëtime nëpër Zvicër për njohje, kohë të lirë dhe përvoja të reja.",
    },
    ligjerata: {
      name: dict.nav.ligjerata,
      description:
        locale === "de"
          ? "Vorträge und Diskussionsrunden zu Studium, Karriere und studentischem Leben."
          : locale === "en"
            ? "Lectures and discussions about studies, career, and student life."
            : "Ligjërata dhe diskutime rreth studimeve, karrierës dhe jetës studentore.",
    },
    sofra: {
      name: dict.nav.sofra,
      description:
        locale === "de"
          ? "Kulturelle Abende mit Essen, Musik und Begegnungen in albanischer Gemeinschaft."
          : locale === "en"
            ? "Cultural evenings with food, music, and gatherings in the Albanian community."
            : "Mbrëmje kulturore me ushqim, muzikë dhe shoqërim në komunitet shqiptar.",
    },
  } as const;

  const selectedEvent = eventMap[slug as keyof typeof eventMap];
  if (!selectedEvent) notFound();

  let galleryImages: { id: number }[] = [];
  let eventPosts: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    cardLinkPath: string | null;
  }[] = [];
  try {
    galleryImages = await prisma.eventGalleryImage.findMany({
      where: { eventSlug: slug },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: { id: true },
    });
  } catch {
    galleryImages = [];
  }

  try {
    eventPosts = await prisma.post.findMany({
      where: { cardLinkPath: `/evente/${slug}` },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        cardLinkPath: true,
      },
    });
  } catch {
    eventPosts = [];
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          {ev.badge}
        </p>
        <h1
          className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {interpolate(ev.title, { name: selectedEvent.name })}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
          {interpolate(ev.intro, { description: selectedEvent.description })}
        </p>

        {galleryImages.length === 0 ? (
          <p className="mt-14 max-w-2xl text-sm text-black/55">{ev.emptyGallery}</p>
        ) : (
          <div className="mt-14 w-full">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black/70">
              {ev.momentsTitle}
            </h2>
            <div className="mt-10 flex w-full flex-col gap-12 md:gap-16">
              {galleryImages.map((img, i) => (
                <div
                  key={img.id}
                  className={`w-full max-w-md border-0 p-0 shadow-none ring-0 outline-none md:max-w-none md:w-2/5 ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}
                >
                  <figure className="m-0 w-full border-0 p-0 shadow-none ring-0 outline-none">
                    <img
                      src={`/api/event-gallery/${img.id}`}
                      alt="Event Moment"
                      decoding="async"
                      className="block h-auto w-full max-h-[60vh] border-0 object-contain shadow-none ring-0 outline-none"
                    />
                  </figure>
                </div>
              ))}
            </div>
          </div>
        )}

        {eventPosts.length > 0 ? (
          <div className="mt-16 border-t border-black/10 pt-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black/70">
              {ev.postsTitle}
            </h2>
            <ul className="mt-8 space-y-6">
              {eventPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={postCardHref({ id: post.id, cardLinkPath: post.cardLinkPath })}
                    className="group flex flex-col overflow-visible rounded-sm border border-black/10 bg-white transition-[border-color,box-shadow] hover:border-[#E11D48]/35 hover:shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/post-image/${post.id}`}
                      alt=""
                      decoding="async"
                      className="w-full h-auto block rounded-t-sm bg-black/5"
                    />
                    <div className="min-w-0 flex-1 p-5">
                      <p className="text-xs text-black/55">
                        <time dateTime={post.createdAt.toISOString()}>
                          {post.createdAt.toLocaleDateString(dateLocale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </p>
                      <h3 className={`${playfair.className} mt-1 text-lg font-bold text-black group-hover:text-[#E11D48]`}>
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-black/65">{textExcerpt(post.content)}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#E11D48]">
                        {ev.readMore} →
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
