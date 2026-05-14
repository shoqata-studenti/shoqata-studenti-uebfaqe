import { SubpageHero } from "@/components/subpage-hero";
import Link from "next/link";

export default function StudimetNeEthPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Studimet ne ETH Zurich" as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>
            ETH Zürich është një nga universitetet teknike më të njohura në botë dhe ofron programe
            studimi në fusha si arkitektura, inxhinieria, shkencat natyrore, informatika dhe
            matematika. Për studentët që dëshirojnë të studiojnë në ETH, kjo platformë synon të
            ofrojë informata bazë dhe orientim.
          </p>
          <p>
            <Link
              href="https://ethz.ch/en/studies.html"
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
