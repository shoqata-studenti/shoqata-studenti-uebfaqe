import "server-only";

/** Imazhe ~6 MB */
export const EVENT_GALLERY_MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/** Video të shkurtra (mp4/webm) */
export const EVENT_GALLERY_MAX_VIDEO_BYTES = 40 * 1024 * 1024;

/** Për UI admin — shifra e përafërt */
export const EVENT_GALLERY_MAX_BYTES = EVENT_GALLERY_MAX_VIDEO_BYTES;

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_MIMES = new Set(["video/mp4", "video/webm"]);

export function isAllowedEventGalleryMime(mime: string): boolean {
  return IMAGE_MIMES.has(mime) || VIDEO_MIMES.has(mime);
}

export function maxBytesForEventGalleryMime(mime: string): number {
  return mime.startsWith("video/") ? EVENT_GALLERY_MAX_VIDEO_BYTES : EVENT_GALLERY_MAX_IMAGE_BYTES;
}
