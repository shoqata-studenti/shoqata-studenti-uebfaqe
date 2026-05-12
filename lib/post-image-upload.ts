import "server-only";

const COVER_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const COVER_VIDEO_MIMES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

/** Imazhe kopertine (~6 MB). */
export const POST_COVER_IMAGE_MAX_BYTES = 6 * 1024 * 1024;

/** Video të shkurtra për kartat (MP4/WebM). */
export const POST_COVER_VIDEO_MAX_BYTES = 40 * 1024 * 1024;

export function isAllowedPostCoverMime(mime: string): boolean {
  if (mime.startsWith("image/")) return COVER_IMAGE_MIMES.has(mime);
  if (mime.startsWith("video/")) return COVER_VIDEO_MIMES.has(mime);
  return false;
}

/** Alias për kod ekzistues. */
export function isAllowedPostImageMime(mime: string): boolean {
  return isAllowedPostCoverMime(mime);
}

export function maxBytesForPostCoverMime(mime: string): number {
  return mime.startsWith("video/") ? POST_COVER_VIDEO_MAX_BYTES : POST_COVER_IMAGE_MAX_BYTES;
}

export function isPostCoverVideo(mime: string): boolean {
  return mime.startsWith("video/");
}
