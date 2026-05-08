import Link from "next/link";

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

  const imagesBySlug = await Promise.all(
    EVENT_SLUGS.map(async (slug) => {
      const rows = await prisma.eventGalleryImage.findMany({
        where: { eventSlug: slug },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true },
      });
      return { slug, ids: rows.map((r) => r.id) };
    })
  );

  const map = Object.fromEntries(imagesBySlug.map((x) => [x.slug, x.ids])) as Record<
    EventSlug,
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
          Ngarko foto (JPEG, PNG, WebP, GIF). Shfaqen në faqen e eventit (zig-zag) dhe si kopertinë në
          ballinë. Maks. ~{maxMb} MB për foto.
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

        <ul className="mt-12 space-y-14">
          {EVENT_SLUGS.map((slug) => {
            const ids = map[slug];
            return (
              <li key={slug} className="border-t border-black/10 pt-12 first:border-t-0 first:pt-0">
                <h2 className="text-lg font-semibold tracking-tight">{EVENT_LABELS_SQ[slug]}</h2>
                <p className="mt-1 text-xs text-black/50">/evente/{slug}</p>

                <form action={uploadEventGalleryImage} encType="multipart/form-data" className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                  <input type="hidden" name="eventSlug" value={slug} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide" htmlFor={`file-${slug}`}>
                      Ngarko foto
                    </label>
                    <input
                      id={`file-${slug}`}
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
                          className="w-full h-auto block rounded-t-sm"
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
                  <p className="mt-4 text-sm text-black/50">Nuk ka foto ende.</p>
                )}
              </li>
            );
          })}
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
