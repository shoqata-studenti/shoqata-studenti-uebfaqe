import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { EventGalleryZigzag } from "@/components/event-gallery-zigzag";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import {
  getLigjerataTopicContent,
  isLigjerataTopicSlug,
} from "@/lib/ligjerata-topics";
import { readLigjerataTopicGalleryBlocks } from "@/lib/ligjerata-topic-media";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });

type Props = { params: Promise<{ topic: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LigjerataTopicPage({ params }: Props) {
  const { topic } = await params;
  if (!isLigjerataTopicSlug(topic)) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ev = dict.evente;
  const content = getLigjerataTopicContent(dict, topic);
  const blocks = await readLigjerataTopicGalleryBlocks(topic);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{ev.badge}</p>
        <p className="mt-4">
          <Link
            href="/evente/ligjerata"
            className="text-sm font-semibold text-[#E11D48] underline-offset-2 hover:underline"
          >
            {ev.ligjerataBackToHub}
          </Link>
        </p>
        <h1
          className={`${playfair.className} mt-6 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {content.title}
        </h1>

        <p className="mt-8 max-w-prose whitespace-pre-line text-[15px] leading-[1.75] text-black/80 md:text-base md:leading-[1.7]">
          {content.body}
        </p>

        {blocks.length === 0 ? (
          <p className="mt-12 text-sm text-black/55">{ev.ligjerataNoMedia}</p>
        ) : (
          <EventGalleryZigzag blocks={blocks} tileWidthClassName="md:w-1/2" />
        )}
      </section>
    </main>
  );
}
