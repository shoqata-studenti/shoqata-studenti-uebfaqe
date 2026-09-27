/**
 * Lokale Sportposts für den Herbst/Winter 2026.
 * Dieser Seed wird absichtlich nicht automatisch ausgeführt.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posterPath = path.join(root, "prisma", "posts-seed", "image-2-2.png");
const VENUE = "Messehalle 9, Thurgauerstrasse 11, 8050 Zürich";
const CARD_LINK_PATH = "/projekte/sporti";
const IMAGE_MIME_TYPE = "image/png";

const EVENTS = [
  ["Futboll", "2026-10-05"],
  ["Volejboll", "2026-10-12"],
  ["Futboll", "2026-10-19"],
  ["Volejboll", "2026-10-26"],
  ["Futboll", "2026-11-02"],
  ["Volejboll", "2026-11-09"],
  ["Futboll", "2026-11-16"],
  ["Volejboll", "2026-11-23"],
  ["Futboll", "2026-11-30"],
  ["Volejboll", "2026-12-07"],
  ["Futboll", "2026-12-14"],
];

function contentFor(title, date) {
  const [year, month, day] = date.split("-");
  return `<p>${title}</p><p>🕗 Uhrzeit: 20:00–22:00 Uhr<br>📍 Ort: ${VENUE}<br>📅 Datum: ${day}.${month}.${year}</p>`;
}

function eventAtFor(date) {
  const timezoneOffset = date < "2026-10-25" ? "+02:00" : "+01:00";
  return new Date(`${date}T20:00:00${timezoneOffset}`);
}

async function main() {
  if (!fs.existsSync(posterPath)) {
    console.error(`Mungon kopertina: ${posterPath}`);
    process.exit(1);
  }

  const imageData = fs.readFileSync(posterPath);

  for (const [title, date] of EVENTS) {
    const i18nKey = `sportSchedule-${date}`;
    const data = {
      i18nKey,
      title,
      content: contentFor(title, date),
      imageMimeType: IMAGE_MIME_TYPE,
      imageData,
      eventAt: eventAtFor(date),
      venue: VENUE,
      cardLinkPath: CARD_LINK_PATH,
    };

    const existing = await prisma.post.findFirst({
      where: { i18nKey },
      select: { id: true },
    });

    if (existing) {
      await prisma.post.update({ where: { id: existing.id }, data });
      console.log(`Post aktualisiert (id ${existing.id}): ${title} ${date}`);
    } else {
      const created = await prisma.post.create({ data });
      console.log(`Post erstellt (id ${created.id}): ${title} ${date}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());