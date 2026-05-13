import "server-only";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";

import { EventGalleryCarouselBlock } from "@/components/event-gallery-carousel-block";
import { EventGallerySlide } from "@/components/event-gallery-slide";

type Props = {
  blocks: GalleryBlock[];
  momentsTitle: string;
  emptyMessage: string;
};

/** Seksioni «Momentet» në faqet e eventeve (zig-zag): një media ose slideshow (Embla). */
export function EventGalleryZigzag({ blocks, momentsTitle, emptyMessage }: Props) {
  if (blocks.length === 0) {
    return <p className="mt-14 max-w-2xl text-sm text-black/55">{emptyMessage}</p>;
  }

  return (
    <div className="mt-14 w-full">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black/70">{momentsTitle}</h2>
      <div className="mt-10 flex w-full flex-col gap-12 md:gap-16">
        {blocks.map((block) => (
          <div
            key={
              block.kind === "single"
                ? `s-${block.items[0].id}`
                : `c-${block.items.map((x) => x.id).join("-")}`
            }
            className="mx-auto w-full max-w-md border-0 p-0 shadow-none ring-0 outline-none"
          >
            {block.kind === "single" ? (
              <EventGallerySlide id={block.items[0].id} mimeType={block.items[0].mimeType} />
            ) : (
              <EventGalleryCarouselBlock items={block.items} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
