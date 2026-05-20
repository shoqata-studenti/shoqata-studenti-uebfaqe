import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

const KAFE_LLAFE_SLUG = "kafe-llafe" as const;

/** Posteri statik (renditja e parë në zig-zag) dhe videoja statike (renditja e dytë). */
const KAFE_LLAFE_POSTER_SRC = "/evente/kafe-llafe-poster.png";
const KAFE_LLAFE_2026_VIDEO_SRC = "/evente/kafe-llafe/2026-moment.mp4";

/** ID sintetike (jo në DB). */
const KAFE_LLAFE_STATIC_POSTER_ID = 87_000;
const KAFE_LLAFE_2026_STATIC_VIDEO_ID = 87_001;

export function kafeLlafeStaticGalleryBlocks(slug: string): GalleryBlock[] {
  if (slug !== KAFE_LLAFE_SLUG) return [];
  return [
    {
      kind: "single",
      items: [
        {
          id: KAFE_LLAFE_STATIC_POSTER_ID,
          mimeType: "image/png",
          src: KAFE_LLAFE_POSTER_SRC,
        },
      ],
    },
    {
      kind: "single",
      items: [
        {
          id: KAFE_LLAFE_2026_STATIC_VIDEO_ID,
          mimeType: "video/mp4",
          src: KAFE_LLAFE_2026_VIDEO_SRC,
        },
      ],
    },
  ];
}
