import "server-only";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { EventGalleryZigzag } from "@/components/event-gallery-zigzag";
import { rowsToGalleryBlocks } from "@/lib/event-gallery-blocks";
import { parseEventEditionYear } from "@/lib/event-editions";
import { getEventPageMeta } from "@/lib/evente-page-meta";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ slug: string; edition: string }>;
};

export default async function EventeEditionPage({ params }: Props) {
  const { slug, edition: editionParam } = await params;
  const editionYear = parseEventEditionYear(editionParam);
  if (editionYear === null) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ev = dict.evente;

  const meta = getEventPageMeta(dict, locale, slug);
  if (!meta) notFound();

  if (meta.slug === "kafe-llafe") {
    redirect(`/evente/${meta.slug}`);
  }

  let galleryBlocks = rowsToGalleryBlocks([]);
  try {
    const rows = await prisma.eventGalleryImage.findMany({
      where: { eventSlug: meta.slug, editionYear },
      orderBy: [{ sortOrder: "asc" }, { slideshowIndex: "asc" }, { id: "asc" }],
      select: {
        id: true,
        mimeType: true,
        sortOrder: true,
        slideshowGroupId: true,
        slideshowIndex: true,
      },
    });
    galleryBlocks = rowsToGalleryBlocks(rows);
  } catch {
    galleryBlocks = rowsToGalleryBlocks([]);
  }

  const editionTitle = interpolate(ev.editionTitle, { name: meta.name, year: String(editionYear) });

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{ev.badge}</p>
        <p className="mt-4">
          <Link
            href={`/evente/${meta.slug}`}
            className="text-sm font-semibold text-[#E11D48] underline-offset-2 hover:underline"
          >
            {interpolate(ev.backToEventHub, { name: meta.name })}
          </Link>
        </p>
        <h1
          className={`${playfair.className} mt-6 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {editionTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
          {interpolate(ev.editionIntro, { description: meta.description, year: String(editionYear) })}
        </p>

        <EventGalleryZigzag
          blocks={galleryBlocks}
          momentsTitle={ev.momentsTitle}
          emptyMessage={ev.emptyEditionGallery}
        />
      </section>
    </main>
  );
}
