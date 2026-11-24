import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

const M1 = "/evente/festa-e-flamurit/2025-moment-1.mp4";
const M2 = "/evente/festa-e-flamurit/2025-moment-2.mp4";
/** Posteri (video) i edicionit 2026 — edhe kopertina e postit në ballinë. */
export const FESTA_FLAMURIT_2026_POSTER_SRC = "/evente/festa-e-flamurit/2026-poster.mp4";

/** Videoja e parë për kartën e vitit në hub `/evente/festa-e-flamurit`. */
export function festaFlamuritHubCardFirstVideoSrc(slug: string, editionYear: number): string | null {
  if (slug !== "festa-e-flamurit") return null;
  if (editionYear === 2026) return FESTA_FLAMURIT_2026_POSTER_SRC;
  if (editionYear === 2025) return M1;
  return null;
}

/** Video statike për edicionet (pa post në DB): 2025 dy video, 2026 posteri. */
export function festaFlamuritStaticGalleryBlocks(slug: string, editionYear: number): GalleryBlock[] {
  if (slug !== "festa-e-flamurit") return [];
  if (editionYear === 2026) {
    return [
      {
        kind: "single",
        items: [{ id: 88_101, mimeType: "video/mp4", src: FESTA_FLAMURIT_2026_POSTER_SRC }],
      },
    ];
  }
  if (editionYear !== 2025) return [];
  return [
    { kind: "single", items: [{ id: 88_001, mimeType: "video/mp4", src: M1 }] },
    { kind: "single", items: [{ id: 88_002, mimeType: "video/mp4", src: M2 }] },
  ];
}
