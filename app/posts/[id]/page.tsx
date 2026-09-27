import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { PostCoverMedia } from "@/components/post-cover-media";
import { prisma } from "@/lib/db";
import { formatDateWithWeekday } from "@/lib/format-datetime";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import { getLocalPreviewPost, localPreviewContent } from "@/lib/local-preview-posts";
import { getLocalizedPostFields } from "@/lib/post-i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const localPost = process.env.NODE_ENV === "development" ? getLocalPreviewPost(numericId) : null;

  let post: Awaited<ReturnType<typeof prisma.post.findUnique>> = null;
  if (!localPost) {
    try {
      post = await prisma.post.findUnique({
        where: { id: numericId },
      });
    } catch {
      notFound();
    }
  }

  if (!post && !localPost) {
    notFound();
  }

  const title = localPost?.title ?? getLocalizedPostFields(dict, post!).title;
  const content = localPost
    ? localPreviewContent(localPost, locale)
    : getLocalizedPostFields(dict, post!).content;
  const eventAt = localPost?.eventAt ?? post!.eventAt;
  const createdAt = localPost?.eventAt ?? post!.createdAt;
  const imageMimeType = localPost?.imageMimeType ?? post!.imageMimeType;

  return (
    <main className="min-h-screen bg-white text-black">
      <article className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <Link
          href="/"
          className="mb-6 mt-8 inline-block text-sm font-semibold uppercase tracking-wide text-[#E11D48] underline-offset-2 hover:underline"
        >
          {dict.post.backHome}
        </Link>

        <h1
          className={`${playfair.className} text-center text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl lg:text-[2.5rem]`}
        >
          {title}
        </h1>
        <p className="mt-3 text-center text-sm text-black/50">
          <time dateTime={eventAt?.toISOString() ?? createdAt.toISOString()}>
            {formatDateWithWeekday(locale, eventAt ?? createdAt)}
          </time>
        </p>

        <div className="mt-12 w-full">
          <PostCoverMedia
            postId={localPost?.id ?? post!.id}
            title={title}
            mimeType={imageMimeType}
            layout="article"
            coverSrc={localPost?.detailCoverSrc ?? localPost?.coverSrc}
          />
        </div>

        {/* HTML-Inhalt wenn <a>/<br> vorhanden, sonst plain text mit Zeilenumbrüchen */}
        {content.includes("<") ? (
          <div
            className="mx-auto mt-14 max-w-2xl text-base leading-[1.85] text-black/90 [&_a]:font-semibold [&_a]:text-[#E11D48] [&_a]:underline-offset-2 [&_a:hover]:underline [&_br]:block [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="mx-auto mt-14 max-w-2xl text-base leading-[1.85] text-black/90 whitespace-pre-wrap">
            {content}
          </div>
        )}
      </article>
    </main>
  );
}
