"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { isAllowedPostImageMime, maxBytesForPostCoverMime } from "@/lib/post-image-upload";
import { isAllowedCardLinkPath } from "@/lib/post-card-links";

async function assertAdminSession() {
  const jar = await cookies();
  if (!isValidAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login?next=/admin/posts");
  }
}

export async function createPost(formData: FormData) {
  await assertAdminSession();
  const title = formData.get("title")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const file = formData.get("file");
  const cardLinkPathRaw = formData.get("cardLinkPath")?.toString().trim() ?? "";
  const cardLinkPath =
    cardLinkPathRaw && isAllowedCardLinkPath(cardLinkPathRaw) ? cardLinkPathRaw : null;

  const eventAtRaw = formData.get("eventAt")?.toString().trim() ?? "";
  let eventAt: Date | null = null;
  if (eventAtRaw) {
    const parsed = new Date(eventAtRaw);
    if (!Number.isNaN(parsed.getTime())) eventAt = parsed;
  }

  const venueRaw = formData.get("venue")?.toString().trim() ?? "";
  const venue = venueRaw.length > 0 ? venueRaw.slice(0, 240) : null;

  if (!title || !content.trim()) {
    redirect("/admin/posts?error=1");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/posts?error=file");
  }

  const mimeType = file.type || "application/octet-stream";
  if (file.size > maxBytesForPostCoverMime(mimeType)) {
    redirect("/admin/posts?error=size");
  }

  if (!isAllowedPostImageMime(mimeType)) {
    redirect("/admin/posts?error=mime");
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const post = await prisma.post.create({
    data: {
      title,
      content: content.trim(),
      imageMimeType: mimeType,
      imageData: buf,
      cardLinkPath,
      eventAt,
      venue,
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.id}`);
  if (post.cardLinkPath) {
    revalidatePath(post.cardLinkPath);
  }

  redirect("/admin/posts?success=1");
}
