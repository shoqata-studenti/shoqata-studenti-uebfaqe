/**
 * Post «Campus Talk me Kryeministrin Albin Kurti» (23.05.2026) për «Në vijim».
 * Ekzekuto: node scripts/seed-campus-talk-kurti.mjs
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posterPath = path.join(root, "prisma", "posts-seed", "campus-talk-kurti-2026.png");

const TITLE = "Campus Talk me Kryeministrin Albin Kurti";

const CONTENT = `<p>Nesër gjatë drekës do të kemi mundësinë të takohemi me Kryeministrin e Republikës së Kosovës, z. Albin Kurti, në një bashkëbisedim ekskluziv. Jemi shumë të lumtur për këtë mundësi të veçantë, e cila realizohet nga Shoqata Studenti në bashkëpunim me Federatën.</p>
<p><strong>Kur?</strong><br>NESËR, të shtunën, më 23.05.2026, rreth orës 13:00.</p>
<p><strong>Ku?</strong><br>Takimi do të zhvillohet në qendër të Cyrihut, në zonën e Niederdörfli-t. Lokacioni i saktë do t'u komunikohet me email vetëm personave të regjistruar.</p>
<p>Regjistrimi është i detyrueshëm.<br>Ju lutemi të keni parasysh se numri i vendeve është i kufizuar dhe pjesëmarrja është e hapur vetëm për personat e regjistruar.</p>
<p>Të dhënat tuaja do të përdoren vetëm për informimin rreth lokacionit dhe do të fshihen pas përfundimit të eventit.</p>
<p>Regjistrohu <a href="https://forms.gle/D3qFHhumLjyWfv8P7" target="_blank" rel="noopener noreferrer">këtu</a></p>`;

/** 23.05.2026, 13:00 — ora lokale e Cyrihut (CEST). */
const EVENT_AT = new Date("2026-05-23T13:00:00+02:00");
const VENUE = "Qendra e Cyrihut, Niederdörfli";

async function main() {
  if (!fs.existsSync(posterPath)) {
    console.error(`Mungon kopertina: ${posterPath}`);
    process.exit(1);
  }

  const imageData = fs.readFileSync(posterPath);
  const imageMimeType = "image/png";

  const existing = await prisma.post.findFirst({
    where: { title: TITLE },
    select: { id: true },
  });

  const data = {
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
