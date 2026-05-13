import Link from "next/link";

import { EventGallerySlide } from "@/components/event-gallery-slide";
import { EVENT_EDITION_YEARS } from "@/lib/event-editions";
import { rowsToGalleryBlocks } from "@/lib/event-gallery-blocks";
import { prisma } from "@/lib/db";
import {
  EVENT_GALLERY_MAX_IMAGE_BYTES,
  EVENT_GALLERY_MAX_VIDEO_BYTES,
} from "@/lib/event-gallery-upload";
import { EVENT_SLUGS, type EventSlug } from "@/lib/event-slugs";

import { deleteEventGalleryImage } from "./actions";
import { EventeUploadForm } from "./upload-form";

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
  const maxImgMb = Math.round(EVENT_GALLERY_MAX_IMAGE_BYTES / (1024 * 1024));
  const maxVidMb = Math.round(EVENT_GALLERY_MAX_VIDEO_BYTES / (1024 * 1024));

  let blocksBySlugYear: Record<string, ReturnType<typeof rowsToGalleryBlocks>> = {};
  let galleryLoadError: string | null = null;
  const key = (slug: EventSlug, year: number) => `${slug}:${year}`;
  try {
    const imageRows = await Promise.all(
      EVENT_SLUGS.flatMap((slug) =>
        EVENT_EDITION_YEARS.map(async (editionYear) => {
          const rows = await prisma.eventGalleryImage.findMany({
            where: { eventSlug: slug, editionYear },
            orderBy: [{ sortOrder: "asc" }, { slideshowIndex: "asc" }, { id: "asc" }],
            select: {
              id: true,
              mimeType: true,
              sortOrder: true,
              slideshowGroupId: true,
              slideshowIndex: true,
            },
          });
          return { slug, editionYear, blocks: rowsToGalleryBlocks(rows) };
        })
      )
    );
    blocksBySlugYear = Object.fromEntries(imageRows.map((r) => [key(r.slug, r.editionYear), r.blocks]));
  } catch (e) {
    galleryLoadError = e instanceof Error ? e.message : String(e);
  }

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
          Ngarko foto ose video për çdo event dhe vit. Mund të krijosh edhe <strong>slideshow</strong> (shumë skedarë në
          një kartë, si Instagram). Publik:{" "}
          <code className="rounded bg-black/[0.06] px-1 text-xs">/evente/slug/vit</code>. Maks. ~{maxImgMb} MB për
          foto, ~{maxVidMb} MB për video (MP4, WebM).
        </p>

        <div className="mt-8 space-y-4">
          {galleryLoadError ? (
            <div className="rounded-sm border border-[#E11D48]/50 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              <p className="font-semibold">Galeria nuk u lexua (Prisma / databaza)</p>
              <p className="mt-2 text-black/80">
                Në terminal: <code className="rounded bg-white px-1 text-xs">npm run db:sync</code> pastaj ndalo dhe
                nis përsëri <code className="rounded bg-white px-1 text-xs">npm run dev</code>.
              </p>
              <p className="mt-2 font-mono text-xs text-black/60">{galleryLoadError}</p>
            </div>
          ) : null}
          {q.ok === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black">
              Ngarkimi u ruajt.
            </p>
          ) : null}
          {q.delOk === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black">
              Skedari u fshi.
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
              Zgjidh të paktën një skedar.
            </p>
          ) : null}
          {q.error === "slideshow" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Slideshow kërkon të paktën dy skedarë (ose hiq shenjën dhe ngarko një të vetëm).
            </p>
          ) : null}
          {q.error === "single" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Pa slideshow, zgjidh vetëm një skedar (ose aktivizo slideshow për disa skedarë).
            </p>
          ) : null}
          {q.error === "count" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Maksimumi është 20 skedarë për një slideshow.
            </p>
          ) : null}
          {q.error === "size" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Një skedar është shumë i madh (foto ~{maxImgMb} MB, video ~{maxVidMb} MB).
            </p>
          ) : null}
          {q.error === "mime" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Lejohen JPEG, PNG, WebP, GIF, MP4 ose WebM.
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
                  const blocks = blocksBySlugYear[key(slug, editionYear)] ?? [];
                  const totalItems = blocks.reduce((n, b) => n + b.items.length, 0);
                  return (
                    <li key={editionYear} className="rounded-sm border border-black/10 bg-black/[0.02] p-4 md:p-5">
                      <h3 className="text-base font-semibold text-black">{editionYear}</h3>
                      <p className="mt-0.5 text-xs text-black/50">
                        Publik: <code className="rounded bg-white px-1">/evente/{slug}/{editionYear}</code>
                      </p>

                      <EventeUploadForm slug={slug} editionYear={editionYear} inputClass={inputClass} />

                      {totalItems > 0 ? (
                        <ul className="mt-6 space-y-6">
                          {blocks.map((block) => (
                            <li
                              key={
                                block.kind === "single"
                                  ? `s-${block.items[0].id}`
                                  : `c-${block.items.map((x) => x.id).join("-")}`
                              }
                              className="rounded-sm border border-black/12 bg-white p-3"
                            >
                              {block.kind === "carousel" ? (
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
                                  Slideshow ({block.items.length})
                                </p>
                              ) : null}
                              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {block.items.map((item) => (
                                  <li
                                    key={item.id}
                                    className="relative overflow-hidden rounded-sm border border-black/10 bg-black/[0.04]"
                                  >
                                    <EventGallerySlide id={item.id} mimeType={item.mimeType} />
                                    <form action={deleteEventGalleryImage} className="absolute right-1 top-1">
                                      <input type="hidden" name="id" value={String(item.id)} />
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
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-sm text-black/50">Nuk ka media për këtë vit.</p>
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
