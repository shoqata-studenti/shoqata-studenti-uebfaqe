import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

function PlaceholderLink({
  href = "#",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-[3px] transition-colors hover:decoration-[#E11D48]"
    >
      {children}
    </Link>
  );
}

export default async function AplikimePage() {
  const dict = getDictionary(await getLocale());
  const s = dict.studimet;

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          {s.badge}
        </p>
        <h1
          className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {s.title}
        </h1>

        <p className="mx-auto mt-12 max-w-2xl text-base leading-relaxed text-black/80 md:text-lg">
          {s.intro}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 md:pb-32">
        <div className="space-y-16">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{s.generalTitle}</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>{s.linkUzhBachelor}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkUzhMaster}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkEthBachelor}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkEthMaster}</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{s.documentsTitle}</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>{s.linkUzhDocs}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkEthDocs}</PlaceholderLink>
              </li>
            </ul>
            <p className="mt-8 rounded-sm border border-black/10 bg-black/[0.02] p-6 text-left text-sm leading-relaxed text-black/80 md:text-base">
              {s.techNote}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{s.deadlinesTitle}</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>{s.linkUzhDeadline}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkEthDeadline}</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{s.visaTitle}</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>{s.linkVisa}</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{s.financeTitle}</h2>
            <p className="mt-6 text-base leading-relaxed text-black/85">{s.financeIntro}</p>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>{s.linkUzhFinance}</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>{s.linkEthFinance}</PlaceholderLink>
              </li>
            </ul>
          </div>

          <p className="border-t border-black/10 pt-12 text-center text-base leading-relaxed text-black/80 md:text-lg">
            {s.closing}
          </p>
        </div>
      </section>
    </main>
  );
}
