import "server-only";

import Link from "next/link";

import { PostCoverMedia } from "@/components/post-cover-media";
import { formatDateWithWeekday, formatTime } from "@/lib/format-datetime";
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
  showTime?: boolean;
  showVenue?: boolean;
  dateLabel?: string;
  dateIcon?: string;
  clickable?: boolean;
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

type Accent = { border: string; glow: string } | null;

function accentForPost(post: UpcomingPost): Accent {
  if (post.title === "25 Vjetori" || post.title === "Activity Fair 2026" || post.title === "Meet Studenti") {
    if (post.title === "25 Vjetori") {
      return { border: "#B91C1C", glow: "rgb(185 28 28 / 0.4)" };
    }
    return { border: "#7E22CE", glow: "rgb(126 34 206 / 0.4)" };
  }

  switch (post.cardLinkPath) {
    case "/evente/kafe-llafe":
      return { border: "#C2410C", glow: "rgb(234 128 20 / 0.4)" };
    case "/projekte/sporti":
      return { border: "#1D4ED8", glow: "rgb(29 78 216 / 0.4)" };
    case "/evente/ligjerata":
      return { border: "#14532D", glow: "rgb(20 83 45 / 0.4)" };
    case "/projekte/kultura/vargjet-e-lira":
      return { border: "#C2410C", glow: "rgb(194 65 12 / 0.4)" };
    case "/evente/festa-e-flamurit":
      return { border: "#B91C1C", glow: "rgb(185 28 28 / 0.4)" };
    default:
      return null;
  }
}

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
            const accent = accentForPost(post);
            const dateStr = post.dateLabel ?? formatDateWithWeekday(locale, post.eventAt);
            const timeStr = formatTime(locale, post.eventAt);
            const place = post.venue?.trim() || u.venueMissing;
            const cardContent = (
              <>
                <h3 className="text-lg font-bold leading-snug text-black">{post.title}</h3>
                <p className="mt-2 text-sm text-black/65">
                  {post.dateIcon ?? "📅"} {dateStr}
                </p>
                {post.showTime === false ? null : (
                  <p className="mt-1 text-sm text-black/65">🕗 {timeStr}</p>
                )}
                {post.showVenue === false ? null : (
                  <p className="mt-1 text-sm text-black/55">📍 {place}</p>
                )}
              </>
            );

            return (
              <li key={post.id} className="flex h-full min-h-0">
                <article
                  className={`relative flex h-full min-h-0 w-full flex-col rounded-sm border bg-white shadow-sm transition-[border-color,box-shadow] hover:shadow-md ${
                    accent
                      ? "border-transparent"
                      : "border-black/12 hover:border-[#E11D48]/35"
                  }`}
                  style={
                    accent
                      ? {
                          boxShadow: `0 0 2px 1px ${accent.glow}, 0 0 4px 4px ${accent.glow}, 0 0 6px 8px ${accent.glow}, 0 0 8px 8px ${accent.glow}, 0 1px 2px rgb(0 0 0 / 0.05)`,
                        }
                      : undefined
                  }
                >
                  <div className="w-full shrink-0">
                    <PostCoverMedia
                      postId={post.id}
                      title={post.title}
                      mimeType={post.imageMimeType}
                      layout="upcoming"
                      coverSrc={post.coverSrc}
                    />
                  </div>
                  {post.clickable === false ? (
                    <div className="mt-auto flex shrink-0 flex-col p-5 pt-4">{cardContent}</div>
                  ) : (
                    <Link
                      href={href}
                      className="group mt-auto flex shrink-0 flex-col p-5 pt-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#E11D48]/40"
                    >
                      {cardContent}
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
