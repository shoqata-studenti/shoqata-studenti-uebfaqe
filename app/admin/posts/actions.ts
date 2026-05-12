"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { isAllowedPostImageMime, POST_IMAGE_MAX_BYTES } from "@/lib/post-image-upload";
import { isAllowedCardLinkPath } from "@/lib/post-card-links";

export async function createPost(formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const file = formData.get("file");
  const cardLinkPathRaw = formData.get("cardLinkPath")?.toString().trim() ?? "";
  const cardLinkPath =
    cardLinkPathRaw && isAllowedCardLinkPath(cardLinkPathRaw) ? cardLinkPathRaw : null;

  if (!title || !content.trim()) {
    redirect("/admin/posts?error=1");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/posts?error=file");
  }

  if (file.size > POST_IMAGE_MAX_BYTES) {
    redirect("/admin/posts?error=size");
  }

  const mimeType = file.type || "application/octet-stream";
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
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.id}`);
  if (post.cardLinkPath) {
    revalidatePath(post.cardLinkPath);
  }

  redirect("/admin/posts?success=1");
}
