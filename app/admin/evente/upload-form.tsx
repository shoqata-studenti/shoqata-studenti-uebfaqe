"use client";

import { useState } from "react";

import { uploadEventGalleryImage } from "@/app/admin/evente/actions";
import type { EventSlug } from "@/lib/event-slugs";

type Props = {
  slug: EventSlug;
  editionYear: number;
  inputClass: string;
};

export function EventeUploadForm({ slug, editionYear, inputClass }: Props) {
  const [slideshow, setSlideshow] = useState(false);

  return (
    <form
      action={uploadEventGalleryImage}
      encType="multipart/form-data"
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <input type="hidden" name="eventSlug" value={slug} />
      <input type="hidden" name="editionYear" value={String(editionYear)} />
      {slideshow ? <input type="hidden" name="galleryMode" value="slideshow" /> : null}
      <div className="min-w-0 flex-1 space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-black/80">
          <input
            type="checkbox"
            checked={slideshow}
            onChange={(e) => setSlideshow(e.target.checked)}
            className="h-4 w-4 rounded border-black/30 text-[#E11D48] focus:ring-[#E11D48]/30"
          />
          Slideshow (shumë foto ose video në një «kartë», si Instagram)
        </label>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide" htmlFor={`file-${slug}-${editionYear}`}>
            {slideshow ? "Ngarko skedarët (2–20)" : "Ngarko një foto ose video"}
          </label>
          <input
            id={`file-${slug}-${editionYear}`}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            required
            multiple={slideshow}
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm bg-[#E11D48] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
      >
        Ruaj
      </button>
    </form>
  );
}
