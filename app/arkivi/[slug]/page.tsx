import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { ArchiveGallery } from "@/components/archive-gallery";
import { archiveEnabled } from "@/lib/archive-config";
import { archivePhotoSrc, getArchiveEvent } from "@/lib/archive-events";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArchiveEventPage({ params }: Props) {
  if (!archiveEnabled()) notFound();

  const { slug } = await params;
  const event = getArchiveEvent(slug);
  if (!event) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const a = dict.archive;
  const text = a.events[event.slug];
  const date = new Intl.DateTimeFormat(dateLocaleFor(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(event.date));

  const photos = event.photos.map((photo) => ({
    full: archivePhotoSrc(event.cloudName, photo.id, "full"),
    thumb: archivePhotoSrc(event.cloudName, photo.id, "thumb"),
    mini: archivePhotoSrc(event.cloudName, photo.id, "mini"),
    download: archivePhotoSrc(event.cloudName, photo.id, "download"),
    width: photo.width,
    height: photo.height,
  }));

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <Link
          href="/arkivi"
          className="text-sm font-semibold text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
        >
          {a.back}
        </Link>
        <h1 className={`${playfair.className} mt-5 text-3xl font-bold tracking-tight md:text-5xl`}>
          {text.title}
        </h1>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
          {date} · {interpolate(a.photoCount, { count: String(photos.length) })}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-[1.75] text-black/75">{text.description}</p>

        <ArchiveGallery photos={photos} eventTitle={text.title} />
      </section>
    </main>
  );
}
