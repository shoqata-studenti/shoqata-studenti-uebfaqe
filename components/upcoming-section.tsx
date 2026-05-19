import "server-only";

import Link from "next/link";

import { PostCoverMedia } from "@/components/post-cover-media";
import { formatEventDateTime } from "@/lib/format-datetime";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { postArticleHref } from "@/lib/post-card-links";

export type UpcomingPost = {
  id: number;
  title: string;
  imageMimeType: string;
  eventAt: Date;
  venue: string | null;
  cardLinkPath: string | null;
  /** Kopertinë statike nga /public (p.sh. `/media/events/berlin.jpg`). */
  coverSrc?: string;
  /** Linku i kartës kur nuk ka artikull në DB (p.sh. `/evente/udhetime/2026`). */
  detailHref?: string;
};

type Props = {
  headingClassName: string;
  posts: UpcomingPost[];
  dict: Dictionary;
  locale: Locale;
};

export function UpcomingSection({ headingClassName, posts, dict, locale }: Props) {
  const u = dict.upcoming;

  if (posts.length === 0) {
    return (
      <section className="bg-black/[0.02]">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <h2
            className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}
          >
            {u.heading}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-black/60">{u.emptyTitle}</p>
          <p className="mt-2 max-w-xl text-sm text-black/55">{u.emptyBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black/[0.02]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <h2
          className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}
        >
          {u.heading}
        </h2>

        <ul className="mt-10 grid auto-rows-fr items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const href = post.detailHref ?? postArticleHref(post.id);
            const dateStr = formatEventDateTime(locale, post.eventAt);
            const place = post.venue?.trim() || u.venueMissing;

            return (
              <li key={post.id} className="flex h-full min-h-0">
                <article className="flex h-full min-h-0 w-full flex-col rounded-sm border border-black/12 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/35 hover:shadow-md">
                  <div className="w-full shrink-0">
                    <PostCoverMedia
                      postId={post.id}
                      title={post.title}
                      mimeType={post.imageMimeType}
                      layout="upcoming"
                      coverSrc={post.coverSrc}
                    />
                  </div>
                  <Link
                    href={href}
                    className="group mt-auto flex shrink-0 flex-col p-5 pt-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#E11D48]/40"
                  >
                    <h3 className="text-lg font-bold leading-snug text-black group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-black/65">{dateStr}</p>
                    <p className="mt-1 text-sm text-black/55">{place}</p>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
