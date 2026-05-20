import "server-only";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import {
  getLigjerataTopicContent,
  LIGJERATA_TOPIC_SLUGS,
} from "@/lib/ligjerata-topics";
import { readLigjerataTopicCover } from "@/lib/ligjerata-topic-media";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });

export const dynamic = "force-dynamic";

export default async function LigjerataHubPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ev = dict.evente;
  const ligjerataLabel = dict.nav.ligjerata;

  const topics = await Promise.all(
    LIGJERATA_TOPIC_SLUGS.map(async (slug) => ({
      content: getLigjerataTopicContent(dict, slug),
      cover: await readLigjerataTopicCover(slug),
    }))
  );

  const cardClass =
    "flex max-w-full flex-col overflow-hidden rounded-sm border border-black/12 bg-white text-center shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md";
  const coverMediaClass = "block w-auto h-auto max-w-full max-h-[55vh]";

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{ev.badge}</p>
        <h1
          className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {ligjerataLabel}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/70 md:text-base">
          {ev.ligjerataBody}
        </p>

        <h2 className="mt-14 text-sm font-bold uppercase tracking-[0.12em] text-black/70">
          {ev.ligjerataTopicsHeading}
        </h2>
        <ul className="mt-6 grid grid-cols-1 items-start justify-items-center gap-6 sm:grid-cols-2">
          {topics.map(({ content, cover }) => (
            <li key={content.slug} className="flex max-w-full">
              <Link href={`/evente/ligjerata/${content.slug}`} className={cardClass}>
                {cover ? (
                  cover.mimeType.startsWith("video/") ? (
                    <video
                      src={cover.src}
                      className={coverMediaClass}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-label={content.title}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover.src} alt={content.title} className={coverMediaClass} decoding="async" />
                  )
                ) : null}
                <div className="flex flex-col items-center justify-center px-5 pb-6 pt-4">
                  <span
                    className={`${playfair.className} text-2xl font-bold text-black md:text-3xl`}
                  >
                    {content.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
