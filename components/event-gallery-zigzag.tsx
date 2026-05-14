import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";
import { cn } from "@/lib/utils";

import { EventGalleryCarouselBlock } from "@/components/event-gallery-carousel-block";
import { EventGallerySlide } from "@/components/event-gallery-slide";

type Props = {
  blocks: GalleryBlock[];
};

/**
 * Zig-zag si versioni i hershëm (commit e361eb3): `flex-col` + `mr-auto`/`ml-auto`
 * dhe `md:w-2/5 md:max-w-none` — funksionon në Safari.
 */
export function EventGalleryZigzag({ blocks }: Props) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 w-full md:mt-14">
      <div className="flex w-full flex-col gap-12 md:gap-16">
        {blocks.map((block, index) => (
          <div
            key={
              block.kind === "single"
                ? `s-${block.items[0].id}`
                : `c-${block.items.map((x) => x.id).join("-")}`
            }
            className={cn(
              "w-full max-w-md border-0 p-0 shadow-none ring-0 outline-none md:max-w-none md:w-2/5",
              index % 2 === 0 ? "mr-auto" : "ml-auto",
            )}
          >
            {block.kind === "single" ? (
              <EventGallerySlide
                id={block.items[0].id}
                mimeType={block.items[0].mimeType}
                src={block.items[0].src}
              />
            ) : (
              <EventGalleryCarouselBlock items={block.items} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
