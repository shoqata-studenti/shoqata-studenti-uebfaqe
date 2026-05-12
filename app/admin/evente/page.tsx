import Link from "next/link";

import { EVENT_EDITION_YEARS } from "@/lib/event-editions";
import { prisma } from "@/lib/db";
import { EVENT_GALLERY_MAX_BYTES } from "@/lib/event-gallery-upload";
import { EVENT_SLUGS, type EventSlug } from "@/lib/event-slugs";

import { deleteEventGalleryImage, uploadEventGalleryImage } from "./actions";

const inputClass =
  "w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25";

type Props = {
  searchParams: Promise<{
    ok?: string;
    delOk?: string;
    error?: string;
    event?: string;
    year?: string;
  }>;
};

const EVENT_LABELS_SQ: Record<EventSlug, string> = {
  "kafe-llafe": "Kafe Llafe",
  "festa-e-flamurit": "Festa e Flamurit",
  udhetime: "Udhëtime",
  ligjerata: "Ligjërata",
  sofra: "Sofra",
};

export default async function AdminEventePage({ searchParams }: Props) {
  const q = await searchParams;
  const maxMb = Math.round(EVENT_GALLERY_MAX_BYTES / (1024 * 1024));

  const imageRows = await Promise.all(
    EVENT_SLUGS.flatMap((slug) =>
      EVENT_EDITION_YEARS.map(async (editionYear) => {
        const rows = await prisma.eventGalleryImage.findMany({
          where: { eventSlug: slug, editionYear },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: { id: true },
        });
        return { slug, editionYear, ids: rows.map((r) => r.id) };
      })
    )
  );

  const key = (slug: EventSlug, year: number) => `${slug}:${year}`;
  const bySlugYear = Object.fromEntries(imageRows.map((r) => [key(r.slug, r.editionYear), r.ids])) as Record<
    string,
    number[]
  >;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Foto eventesh</h1>
        <p className="mt-3 text-sm">
          <Link href="/admin" className="text-black/70 underline-offset-2 hover:text-[#E11D48] hover:underline">
            ← Kthehu te paneli i adminit
          </Link>
        </p>
        <p className="mt-2 text-sm text-black/65">
          Ngarko foto për çdo event dhe vit (2026, 2025, 2024). Shfaqen në faqen e edicionit{" "}
          <code className="rounded bg-black/[0.06] px-1 text-xs">/evente/slug/vit</code> me dizajn zig-zag. Maks. ~{maxMb}{" "}
          MB për foto.
        </p>

        <div className="mt-8 space-y-4">
          {q.ok === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black">
              Foto u ngarkua.
            </p>
          ) : null}
          {q.delOk === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black">
              Foto u fshi.
            </p>
          ) : null}
          {q.error === "slug" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Event i pavlefshëm.
            </p>
          ) : null}
          {q.error === "year" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Vit i pavlefshëm (duhet 2026, 2025 ose 2024).
            </p>
          ) : null}
          {q.error === "file" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Zgjidh një skedar foto.
            </p>
          ) : null}
          {q.error === "size" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Skedari është shumë i madh.
            </p>
          ) : null}
          {q.error === "mime" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Lejohen vetëm JPEG, PNG, WebP ose GIF.
            </p>
          ) : null}
          {q.error === "del" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Fshirja dështoi.
            </p>
          ) : null}
        </div>

        <ul className="mt-12 space-y-16">
          {EVENT_SLUGS.map((slug) => (
            <li key={slug} className="border-t border-black/10 pt-12 first:border-t-0 first:pt-0">
              <h2 className="text-lg font-semibold tracking-tight">{EVENT_LABELS_SQ[slug]}</h2>
              <p className="mt-1 text-xs text-black/50">
                Ballina: <code className="rounded bg-black/[0.06] px-1">/evente/{slug}</code>
              </p>

              <ul className="mt-8 space-y-10">
                {EVENT_EDITION_YEARS.map((editionYear) => {
                  const ids = bySlugYear[key(slug, editionYear)] ?? [];
                  return (
                    <li key={editionYear} className="rounded-sm border border-black/10 bg-black/[0.02] p-4 md:p-5">
                      <h3 className="text-base font-semibold text-black">{editionYear}</h3>
                      <p className="mt-0.5 text-xs text-black/50">
                        Publik: <code className="rounded bg-white px-1">/evente/{slug}/{editionYear}</code>
                      </p>

                      <form
                        action={uploadEventGalleryImage}
                        encType="multipart/form-data"
                        className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
                      >
                        <input type="hidden" name="eventSlug" value={slug} />
                        <input type="hidden" name="editionYear" value={String(editionYear)} />
                        <div className="min-w-0 flex-1 space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wide" htmlFor={`file-${slug}-${editionYear}`}>
                            Ngarko foto
                          </label>
                          <input
                            id={`file-${slug}-${editionYear}`}
                            name="file"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            required
                            className={inputClass}
                          />
                        </div>
                        <button
                          type="submit"
                          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm bg-[#E11D48] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
                        >
                          Ruaj
                        </button>
                      </form>

                      {ids.length > 0 ? (
                        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {ids.map((imgId) => (
                            <li key={imgId} className="relative rounded-sm border border-black/12 bg-black/[0.04]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/api/event-gallery/${imgId}`}
                                alt=""
                                decoding="async"
                                className="block h-auto w-full rounded-t-sm"
                              />
                              <form action={deleteEventGalleryImage} className="absolute right-1 top-1">
                                <input type="hidden" name="id" value={String(imgId)} />
                                <button
                                  type="submit"
                                  className="rounded-sm bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white hover:bg-[#E11D48]"
                                >
                                  Fshi
                                </button>
                              </form>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-black/50">Nuk ka foto për këtë vit.</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-black/50">
          <Link href="/" className="text-[#E11D48] underline-offset-2 hover:underline">
            Kthehu në sajtin publik
          </Link>
        </p>
      </div>
    </main>
  );
}
