import "server-only";

import Link from "next/link";

import { textExcerpt } from "@/lib/excerpt";
import { prisma } from "@/lib/db";

type Props = {
  headingClassName: string;
};

export async function LatestNews({ headingClassName }: Props) {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    posts = [];
  }

  if (posts.length === 0) {
    return (
      <section className="border-t border-black/10 bg-black/[0.02]">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <h2
            className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}
          >
            Lajmet e fundit
          </h2>
          <p className="mt-4 max-w-xl text-sm text-black/60">
            Ende nuk ka poste. Hyni si admin dhe shtoni poste.
          </p>
          <Link
            href="/admin/login?next=/admin/posts"
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-sm border border-black/20 bg-white px-5 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
          >
            Hyr si admin
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-black/10 bg-black/[0.02]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <h2
          className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}
        >
          Lajmet e fundit
        </h2>

        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                    <span className="font-semibold text-[#E11D48]">{post.year}</span>
                    <span className="mx-1.5 text-black/30">·</span>
                    <time dateTime={post.createdAt.toISOString()}>
                      {post.createdAt.toLocaleDateString("sq-AL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </p>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-black">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  );
}
