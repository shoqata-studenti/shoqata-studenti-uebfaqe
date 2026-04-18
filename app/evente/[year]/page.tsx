import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { textExcerpt } from "@/lib/excerpt";
import { prisma } from "@/lib/db";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ year: string }>;
};

export default async function EventeYearPage({ params }: Props) {
  const { year: yearParam } = await params;
  const year = Number.parseInt(yearParam, 10);
  if (Number.isNaN(year)) {
    notFound();
  }

  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    posts = await prisma.post.findMany({
      where: { year },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    posts = [];
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          Evente
        </p>
        <h1
          className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          Evente {year}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">
          Poste dhe njoftime të lidhura me vitin {year}.
        </p>

        {posts.length === 0 ? (
          <p className="mt-14 text-center text-sm text-black/55">
            Nuk ka poste për këtë vit.
          </p>
        ) : (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-sm border border-black/12 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/10] w-full bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-black/55">
                      <time dateTime={post.createdAt.toISOString()}>
                        {post.createdAt.toLocaleDateString("sq-AL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-black">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/70">
                      {textExcerpt(post.content)}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-sm bg-[#E11D48] px-4 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
                      >
                        Lexo më shumë
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
