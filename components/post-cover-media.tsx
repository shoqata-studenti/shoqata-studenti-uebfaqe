import "server-only";

import { PostCoverVideo } from "@/components/post-cover-video";
import { isPostCoverVideo } from "@/lib/post-image-upload";

/** Media nga databaza — MIME në DB (p.sh. video/mp4); nuk përdoret emër skedari .mov/.mp4 në URL. */
const SRC = (postId: number) => `/api/post-image/${postId}`;

type Layout = "upcoming" | "list" | "article";

function classForLayout(layout: Layout): string {
  switch (layout) {
    case "upcoming":
      return "block w-full max-w-full rounded-t-sm bg-black/[0.04]";
    case "list":
      return "block w-full max-w-full bg-black/5 rounded-t-sm";
    case "article":
      return "block w-full max-w-full bg-black/[0.02]";
    default:
      return "block w-full max-w-full";
  }
}

export function PostCoverMedia({
  postId,
  title,
  mimeType,
  layout,
}: {
  postId: number;
  title: string;
  mimeType: string;
  layout: Layout;
}) {
  const src = SRC(postId);
  const cls = `${classForLayout(layout)} h-auto`;

  if (isPostCoverVideo(mimeType)) {
    return <PostCoverVideo src={src} className={cls} title={title} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className={cls} decoding="async" />
  );
}
