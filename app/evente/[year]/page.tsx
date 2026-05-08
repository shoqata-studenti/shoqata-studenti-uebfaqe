import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { textExcerpt } from "@/lib/excerpt";
import { prisma } from "@/lib/db";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";

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

  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
    });
  } catch {
    posts = [];
  }

  let galleryPosts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    galleryPosts = await prisma.post.findMany({
      distinct: ["imageUrl"],
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    galleryPosts = [];
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

        {galleryPosts.length === 0 ? (
          <p className="mt-12 text-center text-sm text-black/55">{ev.empty}</p>
        ) : (
          <div className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black/70">{ev.galleryTitle}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryPosts.map((post) => (
                <li key={`gallery-${post.id}`} className="overflow-hidden rounded-sm border border-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.imageUrl} alt={post.title} className="aspect-[4/3] w-full object-cover" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {posts.length === 0 ? (
          <p className="mt-14 text-center text-sm text-black/55">{ev.empty}</p>
        ) : (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-sm border border-black/12 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/10] w-full bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-black/55">
                      <time dateTime={post.createdAt.toISOString()}>
                        {post.createdAt.toLocaleDateString(dateLocale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-black">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/70">
                      {textExcerpt(post.content)}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-sm bg-[#E11D48] px-4 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
                      >
                        {ev.readMore}
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
