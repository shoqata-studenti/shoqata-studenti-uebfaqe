import type { Metadata } from "next";
import Link from "next/link";

import { SubpageHero } from "@/components/subpage-hero";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Vargjet e lira | Shoqata Studenti Zürich",
  description: "Tekste sipas temave — Shoqata Studenti Zürich.",
};

const cardClass =
  "group block rounded-sm border border-black/12 bg-white p-6 shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/35 hover:shadow-md";

export default async function VargjetELiraPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const topics = await prisma.vargjetTopic.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { documents: true } } },
  });

  return (
    <>
      <SubpageHero title={dict.vargjet.title} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 pt-4 md:px-10">
          <nav className="text-sm text-black/55">
            <Link href="/projekte/kultura" className="hover:text-[#E11D48] hover:underline">
              {dict.nav.kultura}
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <span className="text-black">{dict.vargjet.title}</span>
          </nav>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/75">{dict.vargjet.intro}</p>

          {topics.length === 0 ? (
            <p className="mt-12 text-sm text-black/55">{dict.vargjet.noThemes}</p>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => (
                <li key={t.id}>
                  <Link href={`/projekte/kultura/vargjet-e-lira/${t.slug}`} className={cardClass}>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">
                      {dict.vargjet.themeBadge}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-[#E11D48]">
                      {t.title}
                    </h2>
                    <p className="mt-3 text-sm text-black/55">
                      {t._count.documents}{" "}
                      {t._count.documents === 1 ? dict.vargjet.textSingular : dict.vargjet.textPlural}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
