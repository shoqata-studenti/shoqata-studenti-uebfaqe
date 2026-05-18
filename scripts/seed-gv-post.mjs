/**
 * Post «Kuvendi i Përgjithshëm» (20.05.2026) për «Në vijim».
 * Ekzekuto: `npm run db:seed:gv-post`
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posterPath = path.join(root, "prisma", "posts-seed", "kuvendi-pergjithshem-2026.png");

const I18N_KEY = "gv2026";
const TITLE = "Kuvendi i Përgjithshëm";

const CONTENT = `Ju ftojmë në Kuvendin e Përgjithshëm të Shoqatës Studenti. Në këtë takim do t'i përmbledhim eventet dhe projektet e HS25 dhe FS26. Do të bisedojmë mbi financat dhe federatën, si dhe do ta zgjedhim kryesinë e re.

Data: të mërkurën, më 20.05.2026

Ora: 18:30–20:00

Vendi: KOL-F-121, Rämistrasse 71, 8006 Zürich

Ata që nuk janë të sigurtë nëse janë anëtarë aktiv apo jo, mund të vijnë në orën 18:15 për ta verifikuar statusin e anëtarësisë së tyre; me këtë rast mund ta bëjnë pagesën në vend.

Pas mbledhjes ju ftojmë që të vazhdojmë së bashku në BQM-Bar për një pije.

Sinqerisht,
Kryesia e Shoqatës Studenti`;

/** 20.05.2026, 18:30 — ora lokale e Cyrihut (CEST). */
const EVENT_AT = new Date("2026-05-20T18:30:00+02:00");
const VENUE = "KOL-F-121, Rämistrasse 71, 8006 Zürich";

async function main() {
  if (!fs.existsSync(posterPath)) {
    console.error(`Mungon kopertina: ${posterPath}`);
    process.exit(1);
  }

  const imageData = fs.readFileSync(posterPath);
  const imageMimeType = "image/jpeg";

  const existing = await prisma.post.findFirst({
    where: { OR: [{ i18nKey: I18N_KEY }, { title: TITLE }] },
    select: { id: true },
  });

  const data = {
    i18nKey: I18N_KEY,
    title: TITLE,
    content: CONTENT,
    imageMimeType,
    imageData,
    eventAt: EVENT_AT,
    venue: VENUE,
    cardLinkPath: null,
  };

  if (existing) {
    await prisma.post.update({ where: { id: existing.id }, data });
    console.log(`Post u përditësua (id ${existing.id}): ${TITLE}`);
  } else {
    const created = await prisma.post.create({ data });
    console.log(`Post u krijua (id ${created.id}): ${TITLE}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
