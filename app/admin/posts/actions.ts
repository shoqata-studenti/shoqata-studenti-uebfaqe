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

  const allowedYears = new Set([2023, 2024, 2025, 2026]);

  if (
    !title ||
    !content.trim() ||
    !imageUrl ||
    Number.isNaN(year) ||
    !allowedYears.has(year) ||
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
  revalidatePath(`/evente/${post.year}`);
  revalidatePath(`/posts/${post.id}`);

  redirect("/admin/posts?success=1");
}
