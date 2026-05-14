import { SubpageHero } from "@/components/subpage-hero";
import Link from "next/link";

export default function StudimetNeUniversitatPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Studimet ne Universitat Zurich" as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>
            Universität Zürich është universiteti më i madh në Zvicër dhe ofron një gamë të gjerë
            programesh studimi në fusha të ndryshme akademike, si shkencat sociale, juridiku,
            mjekësia, ekonomia, gjuhët dhe shkencat humane. Për studentët që janë të interesuar për
            studimet në UZH, kjo platformë shërben si një pikë orientimi me informata bazë dhe
            burime të dobishme rreth universitetit dhe programeve të tij.
          </p>
          <p>
            <Link
              href="https://www.uzh.ch/en/studies.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              Kliko këtu
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
