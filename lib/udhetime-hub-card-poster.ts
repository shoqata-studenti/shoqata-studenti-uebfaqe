import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

export const UDHTIME_2026_HUB_POSTER_SRC = "/evente/udhetime/2026-berlin-card.png";

/** Posteri statik për kartën e hub-it `/evente/udhetime` (vit 2026). */
export function udhetimeHubCardPosterSrc(slug: string, editionYear: number): string | null {
  if (slug !== "udhetime" || editionYear !== 2026) return null;
  return UDHTIME_2026_HUB_POSTER_SRC;
}

/** E njëjta grafikë si në hub: blloku i parë në zig-zag për `/evente/udhetime/2026`. */
export function udhetimeEditionGalleryLeadBlocks(slug: string, editionYear: number): GalleryBlock[] {
  if (slug !== "udhetime" || editionYear !== 2026) return [];
  return [
    {
      kind: "single",
      items: [{ id: 77_001, mimeType: "image/png", src: UDHTIME_2026_HUB_POSTER_SRC }],
    },
  ];
}
