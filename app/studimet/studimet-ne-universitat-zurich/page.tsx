import { SubpageHero } from "@/components/subpage-hero";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function StudimetNeUniversitatPage() {
  const copy = getDictionary(await getLocale()).studimetZurich;

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={copy.title} as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>{copy.body}</p>
          <p>
            <Link
              href="https://www.uzh.ch/en/studies.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              {copy.link}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
