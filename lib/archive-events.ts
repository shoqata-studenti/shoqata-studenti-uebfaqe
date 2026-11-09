/**
 * Eventet e arkivit dhe fotot e tyre.
 *
 * Fotot ruhen në Cloudinary; lista e fotove të çdo eventi është në `lib/archive-photos/<slug>.json`
 * dhe krijohet me `npm run archive:upload -- <slug> <dosja-me-foto>` (shih `scripts/archive-upload.mjs`).
 * Cloudinary e zvogëlon çdo foto sipas nevojës (rrjetë, pamje e madhe, miniaturë) dhe e shpërndan me CDN.
 * Titulli dhe përshkrimi i çdo eventi janë në `messages/*.json` → `archive.events.<slug>`.
 */
import photos25Vjetori from "@/lib/archive-photos/25-vjetori.json";

type ArchivePhotoList = {
  cloudName: string;
  photos: { id: string; file: string; width: number; height: number; takenAt: string | null }[];
};

export type ArchivePhoto = {
  /** Public ID në Cloudinary, p.sh. `arkivi/25-vjetori/img-8256`. */
  id: string;
  /** Përmasat e fotos së ruajtur — nevojiten për rrjetën pa kërcime gjatë ngarkimit. */
  width: number;
  height: number;
};

export type ArchiveEventSlug = "25-vjetori";

export type ArchiveEvent = {
  slug: ArchiveEventSlug;
  /** Data e eventit (ISO), shfaqet e formatuar sipas gjuhës. */
  date: string;
  /** Kopertina e kartës në faqen e arkivit (skedar nga `public`), p.sh. posteri i eventit. */
  coverSrc: string;
  /** Proporcioni i kopertinës (gjerësi / lartësi), që karta ta shfaqë të plotë pa e prerë. */
  coverAspect: string;
  cloudName: string;
  photos: ArchivePhoto[];
};

function fromList(list: ArchivePhotoList): Pick<ArchiveEvent, "cloudName" | "photos"> {
  return {
    cloudName: list.cloudName,
    photos: list.photos.map(({ id, width, height }) => ({ id, width, height })),
  };
}

export const ARCHIVE_EVENTS: ArchiveEvent[] = [
  {
    slug: "25-vjetori",
    date: "2026-10-17",
    coverSrc: "/media/25-vjetori.jpeg",
    coverAspect: "4 / 5",
    ...fromList(photos25Vjetori),
  },
];

export function getArchiveEvent(slug: string): ArchiveEvent | null {
  return ARCHIVE_EVENTS.find((event) => event.slug === slug) ?? null;
}

/**
 * Madhësitë që shfaqen në faqe; `f_auto,q_auto` zgjedh formatin dhe cilësinë më të mirë për çdo shfletues.
 * - thumb: rrjeta (rreshta deri 290 px të lartë, edhe për ekrane retina)
 * - mini: shiriti i miniaturave në pamjen e madhe
 * - full: pamja e madhe
 * - download: fotoja e ruajtur, si skedar për shkarkim
 */
const SIZES = {
  thumb: "c_limit,w_900,h_600,f_auto,q_auto",
  mini: "c_fill,w_160,h_160,g_auto,f_auto,q_auto",
  full: "c_limit,w_2000,h_2000,f_auto,q_auto",
  download: "fl_attachment",
} as const;

export function archivePhotoSrc(cloudName: string, id: string, size: keyof typeof SIZES): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${SIZES[size]}/${id}`;
}
