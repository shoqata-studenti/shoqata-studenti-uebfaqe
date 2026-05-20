import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

import type { GalleryBlock } from "@/lib/event-gallery-blocks";
import type { LigjerataTopicSlug } from "@/lib/ligjerata-topics";

const PUBLIC_BASE = path.join(process.cwd(), "public", "evente", "ligjerata");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);

const VIDEO_MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
};

const IMAGE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

/** ID stabël për blloqe statike — nuk përdoret nga `/api/event-gallery/[id]`. */
function stableMediaId(slug: LigjerataTopicSlug, fileName: string): number {
  let h = 5381;
  const key = `${slug}/${fileName}`;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) + h + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h) + 10_000_000;
}

export type LigjerataTopicMedia = {
  src: string;
  mimeType: string;
  fileName: string;
};

function detectMime(fileName: string): string | undefined {
  const ext = path.extname(fileName).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) return IMAGE_MIME[ext];
  if (VIDEO_EXTENSIONS.has(ext)) return VIDEO_MIME[ext];
  return undefined;
}

/** Skedari `cover.<ext>` është mbulesa e kartës dhe nuk hyn në galerinë zig-zag. */
function isCoverFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.startsWith("cover.") && detectMime(lower) !== undefined;
}

async function listSupportedFiles(slug: LigjerataTopicSlug): Promise<string[]> {
  const dir = path.join(PUBLIC_BASE, slug);
  try {
    const entries = await readdir(dir);
    return entries.filter((n) => !n.startsWith(".") && detectMime(n) !== undefined);
  } catch {
    return [];
  }
}

function toMedia(slug: LigjerataTopicSlug, fileName: string): LigjerataTopicMedia {
  return {
    src: `/evente/ligjerata/${slug}/${fileName}`,
    mimeType: detectMime(fileName)!,
    fileName,
  };
}

/**
 * Lexon median e galerisë nga `public/evente/ligjerata/<slug>/` (renditja alfabetike).
 * Skedarët `cover.*` përjashtohen (ato përdoren vetëm si mbulesë e kartës).
 */
export async function readLigjerataTopicMedia(
  slug: LigjerataTopicSlug
): Promise<LigjerataTopicMedia[]> {
  const files = await listSupportedFiles(slug);
  return files
    .filter((n) => !isCoverFile(n))
    .sort((a, b) => a.localeCompare(b))
    .map((n) => toMedia(slug, n));
}

/** Blloqe zig-zag (një media për bllok) për galerinë statike të një teme. */
export async function readLigjerataTopicGalleryBlocks(
  slug: LigjerataTopicSlug
): Promise<GalleryBlock[]> {
  const media = await readLigjerataTopicMedia(slug);
  return media.map((m) => ({
    kind: "single",
    items: [
      {
        id: stableMediaId(slug, m.fileName),
        mimeType: m.mimeType,
        src: m.src,
      },
    ],
  }));
}

/**
 * Mbulesa e kartës. Përparësi ka skedari `cover.<ext>`;
 * përndryshe përdoret media e parë e galerisë.
 */
export async function readLigjerataTopicCover(
  slug: LigjerataTopicSlug
): Promise<LigjerataTopicMedia | null> {
  const files = await listSupportedFiles(slug);
  const cover = files.find(isCoverFile);
  if (cover) return toMedia(slug, cover);
  const gallery = await readLigjerataTopicMedia(slug);
  return gallery[0] ?? null;
}
