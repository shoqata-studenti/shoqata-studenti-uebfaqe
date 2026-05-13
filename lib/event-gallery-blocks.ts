import "server-only";

export type GalleryMediaItem = { id: number; mimeType: string; src?: string };

export type GalleryBlock =
  | { kind: "single"; items: [GalleryMediaItem] }
  | { kind: "carousel"; items: GalleryMediaItem[] };

export type GalleryRow = {
  id: number;
  mimeType: string;
  editionYear?: number;
  sortOrder: number;
  slideshowGroupId: string | null;
  slideshowIndex: number;
};

/** Rreshtat nga DB (të renditur) → blloqe zig-zag: një media ose slideshow. */
export function rowsToGalleryBlocks(rows: GalleryRow[]): GalleryBlock[] {
  const sorted = [...rows].sort((a, b) => {
    if (a.editionYear != null && b.editionYear != null && a.editionYear !== b.editionYear) {
      return b.editionYear - a.editionYear;
    }
    return a.sortOrder - b.sortOrder || a.slideshowIndex - b.slideshowIndex || a.id - b.id;
  });
  const blocks: GalleryBlock[] = [];
  let i = 0;
  while (i < sorted.length) {
    const row = sorted[i];
    if (row.slideshowGroupId == null || row.slideshowGroupId === "") {
      blocks.push({
        kind: "single",
        items: [{ id: row.id, mimeType: row.mimeType }],
      });
      i++;
      continue;
    }
    const gid = row.slideshowGroupId;
    const so = row.sortOrder;
    const ey = row.editionYear;
    const group: GalleryRow[] = [];
    while (
      i < sorted.length &&
      sorted[i].slideshowGroupId === gid &&
      sorted[i].sortOrder === so &&
      (ey === undefined || sorted[i].editionYear === ey)
    ) {
      group.push(sorted[i]);
      i++;
    }
    group.sort((a, b) => a.slideshowIndex - b.slideshowIndex || a.id - b.id);
    const items = group.map((g) => ({ id: g.id, mimeType: g.mimeType }));
    if (items.length === 1) {
      blocks.push({ kind: "single", items: [items[0]!] });
    } else {
      blocks.push({ kind: "carousel", items });
    }
  }
  return blocks;
}
