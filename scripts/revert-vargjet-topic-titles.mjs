/**
 * Rikthen titullat e temave pas ndryshimit të gabuar në data (vetëm titull, jo dokumente).
 * Ekzekuto: `node scripts/revert-vargjet-topic-titles.mjs`
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TITLE_BY_SLUG = {
  "kuvendi-i-berlinit": "Kuvendi i Berlinit",
  "abeceja-shqipe": "Abeceja Shqipe",
  gjakmarrja: "Gjakmarrja",
};

const WRONG_DATE_TITLES = new Set([
  "2.4.26",
  "23.4.26",
  "7.5.26",
  "02.04.26",
  "23-4-2026",
  "07-05-2026",
]);

async function main() {
  for (const [slug, title] of Object.entries(TITLE_BY_SLUG)) {
    const r = await prisma.vargjetTopic.updateMany({ where: { slug }, data: { title } });
    if (r.count) console.log(`slug ${slug} → «${title}»`);
  }

  const orphans = await prisma.vargjetTopic.findMany({
    where: { sortOrder: { in: [1, 2, 3] }, title: { in: [...WRONG_DATE_TITLES] } },
  });
  for (const t of orphans) {
    if (TITLE_BY_SLUG[t.slug]) continue;
    await prisma.vargjetTopic.update({ where: { id: t.id }, data: { title: "Tema" } });
    console.log(`id ${t.id} (slug ${t.slug}) → «Tema»`);
  }

  console.log("Titullat u rikthyen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
