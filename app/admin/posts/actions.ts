"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createPost(formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";
  const yearRaw = formData.get("year")?.toString().trim() ?? "";
  const year = Number.parseInt(yearRaw, 10);

  if (
    !title ||
    !content.trim() ||
    !imageUrl ||
    Number.isNaN(year) ||
    year < 1900 ||
    year > 2100 ||
    !isValidHttpUrl(imageUrl)
  ) {
    redirect("/admin/posts?error=1");
  }

  const post = await prisma.post.create({
    data: {
      title,
      content: content.trim(),
      imageUrl,
      year,
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.id}`);

  redirect("/admin/posts?success=1");
}
