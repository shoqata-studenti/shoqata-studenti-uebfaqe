import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

const M1 = "/evente/festa-e-flamurit/2025-moment-1.mp4";
const M2 = "/evente/festa-e-flamurit/2025-moment-2.mp4";

/** Videoja e parë për kartën e vitit në hub `/evente/festa-e-flamurit`. */
export function festaFlamuritHubCardFirstVideoSrc(slug: string, editionYear: number): string | null {
  if (slug !== "festa-e-flamurit" || editionYear !== 2025) return null;
  return M1;
}

/** Dy video statike për edicionin 2025 (pa post në DB). */
export function festaFlamuritStaticGalleryBlocks(slug: string, editionYear: number): GalleryBlock[] {
  if (slug !== "festa-e-flamurit" || editionYear !== 2025) return [];
  return [
    { kind: "single", items: [{ id: 88_001, mimeType: "video/mp4", src: M1 }] },
    { kind: "single", items: [{ id: 88_002, mimeType: "video/mp4", src: M2 }] },
  ];
}
