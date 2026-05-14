/**
 * Ngarkon temat «Vargjet e lira» dhe PDF-et nga `prisma/vargjet-seed/`.
 * Ekzekuto: `npm run db:seed:vargjet`
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedDir = path.join(root, "prisma", "vargjet-seed");

/** @param {{ slug: string, title: string, sortOrder: number, docs: { file: string, title: string, originalFileName: string }[] }} def */
async function upsertTopicWithDocs(def) {
  const topic = await prisma.vargjetTopic.upsert({
    where: { slug: def.slug },
    create: { slug: def.slug, title: def.title, sortOrder: def.sortOrder },
    update: { title: def.title, sortOrder: def.sortOrder },
  });

  await prisma.vargjetDocument.deleteMany({ where: { topicId: topic.id } });

  for (const d of def.docs) {
    const abs = path.join(seedDir, d.file);
    if (!fs.existsSync(abs)) {
      console.warn(`Mungon skedari: ${abs}`);
      continue;
    }
    const buf = fs.readFileSync(abs);
    await prisma.vargjetDocument.create({
      data: {
        topicId: topic.id,
        title: d.title,
        originalFileName: d.originalFileName,
        mimeType: "application/pdf",
        fileData: buf,
      },
    });
  }
}

async function main() {
  await upsertTopicWithDocs({
    slug: "kuvendi-i-berlinit",
    title: "Kuvendi i Berlinit",
    sortOrder: 1,
    docs: [
      {
        file: "kuvendi-lahuta-e-malcis-rome-1958.pdf",
        title: "Lahuta e Malcis — Romë 1958",
        originalFileName: "Kuvendi i Berlinit (Lahuta e Malcis - Romë 1958).pdf",
      },
      {
        file: "kuvendi-pershtatur.pdf",
        title: "Kuvendi i Berlinit (Përshtatur)",
        originalFileName: "Kuvendi i Berlinit (Përshtatur).pdf",
      },
      {
        file: "kenga-avdyl-frasherit.pdf",
        title: "Kënga e Avdyl Frashërit (Këngë labe)",
        originalFileName: "Kënga e Avdyl Frashërit (Këngë labe).pdf",
      },
    ],
  });

  await upsertTopicWithDocs({
    slug: "abeceja-shqipe",
    title: "Abeceja Shqipe",
    sortOrder: 2,
    docs: [
      {
        file: "vendimi-kuvendi-manastirit.pdf",
        title: "Vendimi i Kuvendit të Manastirit",
        originalFileName: "Vendimi i Kuvendit të Manastirit.pdf",
      },
      {
        file: "cfituam-kongresi-manastirit.pdf",
        title: "Ç'Fituam nga Kongresi i Manastirit (Mid'hat Frashëri — Selanik 1908)",
        originalFileName: "Ç'Fituam nga Kongresi i Manastirit (Mid'hat Frashëri - Selanik 1908).pdf",
      },
      {
        file: "abc-halo-mala-nentor-2024.pdf",
        title: "ABC-ja (Halo Mala — nëntor 2024)",
        originalFileName: "ABC-ja (Halo Mala - nëntor 2024).pdf",
      },
    ],
  });

  await prisma.vargjetTopic.updateMany({
    where: { slug: "gjakmarrja" },
    data: { sortOrder: 3, title: "Gjakmarrja" },
  });

  console.log("Vargjet: u përditësuan temat (1 Kuvendi, 2 Abeceja, 3 Gjakmarrja) dhe dokumentet.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
