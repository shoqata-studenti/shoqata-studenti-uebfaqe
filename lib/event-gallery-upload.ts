import "server-only";

/** ~6 MB */
export const EVENT_GALLERY_MAX_BYTES = 6 * 1024 * 1024;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function isAllowedEventGalleryMime(mime: string): boolean {
  return ALLOWED.has(mime);
}
