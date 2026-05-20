import { EventGalleryZigzag } from "@/components/event-gallery-zigzag";
import { SubpageHero } from "@/components/subpage-hero";
import type { GalleryBlock } from "@/lib/event-gallery-blocks";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const SPORTI_GALLERY_BLOCKS: GalleryBlock[] = [
  {
    kind: "single",
    items: [{ id: 86_001, mimeType: "video/mp4", src: "/projekte/sporti/futboll.mp4" }],
  },
  {
    kind: "single",
    items: [{ id: 86_002, mimeType: "video/mp4", src: "/projekte/sporti/volleyball.mp4" }],
  },
];

export default async function SportiPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.sporti} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <p className="max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.sport.intro}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.sport.goal}
          </p>

          <EventGalleryZigzag blocks={SPORTI_GALLERY_BLOCKS} />
        </div>
      </div>
    </>
  );
}
