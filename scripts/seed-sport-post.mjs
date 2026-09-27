/**
 * Testpost «Sport und Bewegung» für Montag, den 05.10.2026.
 * Ausführen: `npm run db:seed:sport-post`
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const I18N_KEY = "sportPost2026";
const TITLE = "Sport und Bewegung";
const EVENT_AT = new Date("2026-10-05T18:00:00+02:00");
const VENUE = "Zürich";

const CONTENT = `Gemeinsam aktiv sein, neue Energie tanken und eine gute Zeit verbringen.

Am Montag treffen wir uns zu einem lockeren Sportabend. Alle sind willkommen, unabhängig von Erfahrung oder Fitnesslevel.

Datum: Montag, 05.10.2026
Zeit: 18:00 Uhr
Ort: Zürich`;

// Das aktuelle Datenmodell verlangt Bilddaten; dieser transparente Pixel erscheint als kein Bild.
const imageData = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

async function main() {
  const existing = await prisma.post.findFirst({
    where: { i18nKey: I18N_KEY },
    select: { id: true },
  });

  const data = {
    i18nKey: I18N_KEY,
    title: TITLE,
    content: CONTENT,
    imageMimeType: "image/png",
    imageData,
    eventAt: EVENT_AT,
    venue: VENUE,
    cardLinkPath: null,
  };

  if (existing) {
    await prisma.post.update({ where: { id: existing.id }, data });
    console.log(`Post aktualisiert (id ${existing.id}): ${TITLE}`);
  } else {
    const created = await prisma.post.create({ data });
    console.log(`Post erstellt (id ${created.id}): ${TITLE}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());