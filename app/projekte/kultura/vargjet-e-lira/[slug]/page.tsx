import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SubpageHero } from "@/components/subpage-hero";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await prisma.vargjetTopic.findUnique({ where: { slug } });
  if (!topic) {
    return { title: "Vargjet e lira | Shoqata Studenti Zürich" };
  }
  return {
    title: `${topic.sortOrder}. ${topic.title}`,
    description: topic.title,
  };
}

export default async function VargjetTopicPage({ params }: Props) {
  const { slug } = await params;

  const topic = await prisma.vargjetTopic.findUnique({
    where: { slug },
    include: { documents: { orderBy: { id: "asc" } } },
  });

  if (!topic) {
    notFound();
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={`${topic.sortOrder}. ${topic.title}`} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 pt-4 md:px-10">
          <nav className="text-sm text-black/55">
            <Link href="/projekte/kultura" className="hover:text-[#E11D48] hover:underline">
              {dict.nav.kultura}
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <Link
              href="/projekte/kultura/vargjet-e-lira"
              className="hover:text-[#E11D48] hover:underline"
            >
              {dict.vargjet.title}
            </Link>
            <span className="mx-2 text-black/30">/</span>
            <span className="text-black">{topic.sortOrder}. {topic.title}</span>
          </nav>

          <h2 className="mt-10 text-lg font-semibold tracking-tight text-black">
            {dict.vargjet.documentsHeading}
          </h2>

          {topic.documents.length === 0 ? (
            <p className="mt-4 text-sm text-black/55">{dict.vargjet.noDocuments}</p>
          ) : (
            <ul className="mt-6 divide-y divide-black/10 border border-black/10 rounded-sm">
              {topic.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-black">{doc.title}</p>
                    <p className="mt-0.5 truncate text-xs text-black/45">{doc.originalFileName}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a
                      href={`/api/vargjet-e-lira/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center justify-center rounded-sm border border-black/20 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
                    >
                      {dict.vargjet.open}
                    </a>
                    <a
                      href={`/api/vargjet-e-lira/${doc.id}?download=1`}
                      className="inline-flex min-h-9 items-center justify-center rounded-sm bg-[#E11D48] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
                    >
                      {dict.vargjet.download}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
