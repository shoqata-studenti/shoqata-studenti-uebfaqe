/**
 * Füllt leere surname-Felder: Name aufteilen; wenn uni wie Nachname aussieht → uni → surname.
 * Ausführen: node scripts/backfill-member-surname.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UNI_HINT =
  /eth|uzh|universit|hochschule|zhaw|fhnw|hsr|basel|bern|zürich|zurich|st\.?\s*gallen|lausanne|luzern|winterthur|cyrih|phzh|ffhs/i;

function splitName(full) {
  const t = full.trim();
  if (!t) return { name: "", surname: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { name: t, surname: "" };
  return { name: t.slice(0, i).trim(), surname: t.slice(i + 1).trim() };
}

function looksLikeUniversity(uni) {
  const u = uni.trim();
  if (!u) return false;
  if (UNI_HINT.test(u)) return true;
  if (/\d/.test(u)) return true;
  if (u.length > 28) return true;
  return false;
}

async function main() {
  const members = await prisma.member.findMany();
  let updated = 0;

  for (const m of members) {
    let name = m.name.trim();
    let surname = (m.surname ?? "").trim();
    let uni = m.uni.trim();

    if (!surname && name.includes(" ")) {
      const s = splitName(name);
      name = s.name;
      surname = s.surname;
    }

    if (!surname && uni && !looksLikeUniversity(uni)) {
      surname = uni;
      uni = "";
    }

    if (name !== m.name || surname !== (m.surname ?? "") || uni !== m.uni) {
      await prisma.member.update({
        where: { id: m.id },
        data: { name, surname, uni },
      });
      console.log(`#${m.id} ${m.email}: name="${name}" surname="${surname}" uni="${uni}"`);
      updated++;
    }
  }

  console.log(`Done. Updated ${updated} of ${members.length} member(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
