/**
 * Post «Activity Fair 2026» für «Në vijim».
 * Die Anhänge liegen in `prisma/posts-seed/`.
 * Das Preview-Bild wird nach `public/evente/acivityfair_post.JPG` kopiert.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedDir = path.join(root, "prisma", "posts-seed");
const sourceCardPath = path.join(seedDir, "acivityfair_post.JPG");
const cardPath = path.join(root, "public", "evente", "acivityfair_post.JPG");
const detailPath = path.join(seedDir, "Activity-fair.png");
const I18N_KEY = "activityFair2026";
const EVENT_AT = new Date("2026-09-22T09:30:00+02:00");
const VENUE = "UZH Lichthof Irchel / Lichthof Zentrum; ETH Gebäude HG (Zentrum)";

async function main() {
  if (!sourceCardPath || !fs.existsSync(detailPath)) {
    console.error("Erwartet prisma/posts-seed/acivityfair_post.JPG und prisma/posts-seed/Activity-fair.png.");
    process.exit(1);
  }

  fs.copyFileSync(sourceCardPath, cardPath);
  const imageData = fs.readFileSync(detailPath);
  const existing = await prisma.post.findFirst({
    where: { i18nKey: I18N_KEY },
    select: { id: true },
  });

  const data = {
    i18nKey: I18N_KEY,
    title: "Activity Fair 2026",
    content: "Activity Fair 2026",
    imageMimeType: "image/png",
    imageData,
    eventAt: EVENT_AT,
    venue: VENUE,
    cardLinkPath: null,
  };

  if (existing) {
    await prisma.post.update({ where: { id: existing.id }, data });
    console.log(`Post aktualisiert (id ${existing.id}): Activity Fair 2026`);
  } else {
    const created = await prisma.post.create({ data });
    console.log(`Post erstellt (id ${created.id}): Activity Fair 2026`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());