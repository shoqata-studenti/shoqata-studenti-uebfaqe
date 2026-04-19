import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { prisma } from "@/lib/db";
import { dateLocaleFor, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dateLocale = dateLocaleFor(locale);

  let post: Awaited<ReturnType<typeof prisma.post.findUnique>> = null;
  try {
    post = await prisma.post.findUnique({
      where: { id: numericId },
    });
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <article className="mx-auto w-full max-w-4xl px-6 py-14 md:px-10 md:py-20">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-wide text-[#E11D48] underline-offset-2 hover:underline"
        >
          {dict.post.backHome}
        </Link>

        <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">
          {post.year}
        </p>
        <h1
          className={`${playfair.className} mt-3 text-center text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl lg:text-[2.5rem]`}
        >
          {post.title}
        </h1>
        <p className="mt-3 text-center text-sm text-black/50">
          <time dateTime={post.createdAt.toISOString()}>
            {post.createdAt.toLocaleDateString(dateLocale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <div className="mt-12 overflow-hidden rounded-sm border border-black/10 bg-black/[0.02]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full object-cover md:max-h-[min(60vh,520px)]"
            width={1200}
            height={675}
          />
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-base leading-[1.85] text-black/90">
          {post.content.split("\n\n").map((block, i) => (
            <p key={i} className="whitespace-pre-wrap [&:not(:first-child)]:mt-6">
              {block}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
