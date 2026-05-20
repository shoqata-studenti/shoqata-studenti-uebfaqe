import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

export const UDHTIME_2026_HUB_POSTER_SRC = "/evente/udhetime/2026-berlin-card.png";

const UDHTIME_2025_COVER_SRC = "/evente/udhetime/2025/cover.png";

const UDHTIME_2025_GALLERY: { id: number; src: string }[] = [
  { id: 78_000, src: "/evente/udhetime/2025/00-itinerary.png" },
  { id: 78_001, src: "/evente/udhetime/2025/01-piana.png" },
  { id: 78_002, src: "/evente/udhetime/2025/02-mural.png" },
  { id: 78_003, src: "/evente/udhetime/2025/03-mural.png" },
];

/** Posteri / mbulesa për kartën e hub-it dhe titullin e edicionit 2025. */
export function udhetimeHubCardPosterSrc(slug: string, editionYear: number): string | null {
  if (slug !== "udhetime") return null;
  if (editionYear === 2026) return UDHTIME_2026_HUB_POSTER_SRC;
  if (editionYear === 2025) return UDHTIME_2025_COVER_SRC;
  return null;
}

/** URL e mbulesës së kartës — nuk duhet të përsëritet në zig-zag. */
export function udhetimeHubPosterSrcForEdition(slug: string, editionYear: number): string | null {
  return udhetimeHubCardPosterSrc(slug, editionYear);
}

/** Heq blloket zig-zag që përsërisin mbulesën e kartës (edhe nga DB). */
export function stripUdhetimeHubPosterFromGalleryBlocks(
  slug: string,
  editionYear: number,
  blocks: GalleryBlock[]
): GalleryBlock[] {
  const hubPoster = udhetimeHubPosterSrcForEdition(slug, editionYear);
  if (!hubPoster) return blocks;
  return blocks.filter((block) => {
    if (block.kind !== "single") return true;
    const src = block.items[0]?.src?.trim();
    return src !== hubPoster;
  });
}

/** Galeria zig-zag statike për Sicilia 2025 (pa `cover.png`). */
export function udhetimeEdition2025GalleryBlocks(slug: string, editionYear: number): GalleryBlock[] {
  if (slug !== "udhetime" || editionYear !== 2025) return [];
  return UDHTIME_2025_GALLERY.map((item) => ({
    kind: "single" as const,
    items: [{ id: item.id, mimeType: "image/png", src: item.src }],
  }));
}
