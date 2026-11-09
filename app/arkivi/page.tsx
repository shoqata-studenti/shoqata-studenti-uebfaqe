import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { archiveEnabled } from "@/lib/archive-config";
import { ARCHIVE_EVENTS } from "@/lib/archive-events";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function ArchivePage() {
  if (!archiveEnabled()) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const a = dict.archive;
  const dateFormat = new Intl.DateTimeFormat(dateLocaleFor(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="max-w-3xl border-l-4 border-[#E11D48] pl-6 md:pl-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{a.badge}</p>
          <h1 className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight md:text-5xl`}>
            {a.title}
          </h1>
          <p className="mt-6 text-base leading-[1.8] text-black/75 md:text-lg">{a.intro}</p>
        </div>

        <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.12em] text-black/70">
          {a.eventsHeading}
        </h2>

        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHIVE_EVENTS.map((event) => {
            const text = a.events[event.slug];
            return (
              <li key={event.slug}>
                <Link
                  href={`/arkivi/${event.slug}`}
                  className="group block overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/10 transition-shadow hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D48]"
                >
                  <div
                    className="relative w-full overflow-hidden bg-black"
                    style={{ aspectRatio: event.coverAspect }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.coverSrc}
                      alt=""
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/55">
                      {dateFormat.format(new Date(event.date))}
                    </p>
                    <h3 className={`${playfair.className} mt-1.5 text-2xl font-bold text-black`}>{text.title}</h3>
                    <p className="mt-3 flex items-center justify-between gap-3 text-sm text-black/65">
                      <span>{interpolate(a.photoCount, { count: String(event.photos.length) })}</span>
                      <span className="font-semibold text-[#E11D48] transition-transform group-hover:translate-x-1">
                        {a.viewPhotos} →
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
