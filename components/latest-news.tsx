import "server-only";

import Link from "next/link";

import { textExcerpt } from "@/lib/excerpt";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { postCardHref } from "@/lib/post-card-links";

export type LatestNewsPost = {
  id: number;
  title: string;
  content: string;
  cardLinkPath: string | null;
  createdAt: Date;
};

type Props = {
  headingClassName: string;
  posts: LatestNewsPost[];
  labels: Dictionary["latestNews"];
  dateLocale: string;
};

export function LatestNews({ headingClassName, posts, labels, dateLocale }: Props) {
  if (posts.length === 0) {
    return (
      <section className="border-t border-black/10 bg-black/[0.02]">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <h2
            className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}
          >
            {labels.heading}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-black/60">{labels.emptyTitle}</p>
          <p className="mt-2 max-w-xl text-sm text-black/55">{labels.emptyBody}</p>
          <Link
            href="/admin/login?next=/admin"
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-sm border border-black/20 bg-white px-5 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
          >
            {labels.adminCta}
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
          {labels.heading}
        </h2>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-sm border border-black/12 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] w-full bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/post-image/${post.id}`}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-black/55">
                    <time dateTime={post.createdAt.toISOString()}>
                      {post.createdAt.toLocaleDateString(dateLocale, {
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
                      href={postCardHref({ id: post.id, cardLinkPath: post.cardLinkPath })}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-sm bg-[#E11D48] px-4 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
                    >
                      {labels.readMore}
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
