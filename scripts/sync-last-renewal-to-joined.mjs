/**
 * Setzt bei allen Mitgliedern lastRenewalAt = joinedAt (einmaliger Backfill).
 * Ausführen: node scripts/sync-last-renewal-to-joined.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const before = await prisma.member.count();
  const result = await prisma.$executeRaw`
    UPDATE "Member" SET "lastRenewalAt" = "joinedAt"
  `;

  console.log(`Done. ${before} member(s); rows updated: ${result}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
