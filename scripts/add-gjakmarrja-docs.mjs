/**
 * Shton dokumente shtesë te tema «Gjakmarrja» (vargjet e lira), pa fshirë ato ekzistuese.
 * Idempotent: nuk shton dy herë të njëjtin `originalFileName` brenda të njëjtës temë.
 * Ekzekuto: `node scripts/add-gjakmarrja-docs.mjs`
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedDir = path.join(root, "prisma", "vargjet-seed");

const TOPIC_SLUG = "gjakmarrja";

const DOCS = [
  {
    file: "gjakmarrja-pajtimi-i-gjeqeve.pdf",
    title: "Pajtimi i Gjaqeve (Anton Çetta — Drenicë 1990)",
    originalFileName: "Pajtimi i Gjeqeve (Anton Çetta - Drenicë 1990).pdf",
  },
  {
    file: "gjakmarrja-prilli-i-thyer.pdf",
    title: "Prilli i Thyer (Ismail Kadare — Kreu i Parë)",
    originalFileName: "Prilli i Thyer (Ismail Kadare - Kreu i Parë).pdf",
  },
];

async function main() {
  const topic = await prisma.vargjetTopic.findUnique({ where: { slug: TOPIC_SLUG } });
  if (!topic) {
    throw new Error(`Tema «${TOPIC_SLUG}» nuk u gjet në bazën e të dhënave.`);
  }

  for (const d of DOCS) {
    const abs = path.join(seedDir, d.file);
    if (!fs.existsSync(abs)) {
      console.warn(`Mungon skedari: ${abs}`);
      continue;
    }

    const exists = await prisma.vargjetDocument.findFirst({
      where: { topicId: topic.id, originalFileName: d.originalFileName },
      select: { id: true },
    });
    if (exists) {
      console.log(`Skip (ekziston): ${d.originalFileName}`);
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
    console.log(`U shtua: ${d.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
