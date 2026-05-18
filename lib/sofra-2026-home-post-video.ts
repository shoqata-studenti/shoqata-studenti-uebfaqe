import "server-only";

import { prisma } from "@/lib/db";
import type { GalleryBlock } from "@/lib/event-gallery-blocks";
import { isPostCoverVideo } from "@/lib/post-image-upload";
import { sofraEdition2026StaticGalleryBlocks } from "@/lib/sofra-static-gallery";

const SOFRA_SLUG = "sofra" as const;
const SOFRA_HUB_CARD_PATH = "/evente/sofra" as const;

export type SofraHomePostCover = {
  postId: number;
  imageMimeType: string;
};

/**
 * I njëjti post si në «Në vijim» në ballinë: `cardLinkPath` = `/evente/sofra`, kopertinë video.
 * Renditje si `app/page.tsx` (eventAt asc).
 */
export async function fetchSofra2026HomepagePostVideo(): Promise<SofraHomePostCover | null> {
  try {
    const post = await prisma.post.findFirst({
      where: {
        cardLinkPath: SOFRA_HUB_CARD_PATH,
        eventAt: { not: null },
        imageMimeType: { startsWith: "video/" },
      },
      orderBy: { eventAt: "asc" },
      select: { id: true, imageMimeType: true },
    });
    if (!post || !isPostCoverVideo(post.imageMimeType)) return null;
    return { postId: post.id, imageMimeType: post.imageMimeType };
  } catch {
    return null;
  }
}

/** Zig-zag për `/evente/sofra/2026`: video nga post (nëse ka) + video statik (autoplay, loop). */
export async function sofraEdition2026GalleryLeadBlocks(
  slug: string,
  editionYear: number,
): Promise<GalleryBlock[]> {
  if (slug !== SOFRA_SLUG || editionYear !== 2026) return [];

  const blocks: GalleryBlock[] = [];
  const cover = await fetchSofra2026HomepagePostVideo();
  if (cover) {
    blocks.push({
      kind: "single",
      items: [
        {
          id: cover.postId,
          mimeType: cover.imageMimeType,
          src: `/api/post-image/${cover.postId}`,
        },
      ],
    });
  }

  blocks.push(...sofraEdition2026StaticGalleryBlocks(slug, editionYear));
  return blocks;
}
