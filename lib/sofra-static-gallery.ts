import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

const SOFRA_SLUG = "sofra" as const;

/** Video statik për `/evente/sofra/2026` (zig-zag, autoplay, loop). */
export const SOFRA_2026_GALLERY_VIDEO_SRC = "/evente/sofra/2026-moment.mp4";

/** ID sintetike (jo në DB) — si te Festa e Flamurit. */
const SOFRA_2026_STATIC_VIDEO_ID = 89_001;

export function sofraEdition2026StaticGalleryBlocks(slug: string, editionYear: number): GalleryBlock[] {
  if (slug !== SOFRA_SLUG || editionYear !== 2026) return [];
  return [
    {
      kind: "single",
      items: [{ id: SOFRA_2026_STATIC_VIDEO_ID, mimeType: "video/mp4", src: SOFRA_2026_GALLERY_VIDEO_SRC }],
    },
  ];
}
