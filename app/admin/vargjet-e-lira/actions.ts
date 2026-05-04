"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { slugifyTitle } from "@/lib/vargjet-slug";
import { VARGJET_MAX_FILE_BYTES, isAllowedVargjetMime } from "@/lib/vargjet-upload";

function revalidateVargjet() {
  revalidatePath("/projekte/kultura/vargjet-e-lira");
  revalidatePath("/projekte/kultura");
}

async function uniqueSlugFromTitle(title: string): Promise<string> {
  const base = slugifyTitle(title);
  let candidate = base;
  let n = 0;
  while (await prisma.vargjetTopic.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export async function createVargjetTopic(formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  if (!title) {
    redirect("/admin/vargjet-e-lira?topicError=1");
  }

  const maxOrder = await prisma.vargjetTopic.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;
  const slug = await uniqueSlugFromTitle(title);

  await prisma.vargjetTopic.create({
    data: { title, slug, sortOrder },
  });

  revalidateVargjet();
  redirect("/admin/vargjet-e-lira?topicOk=1");
}

export async function uploadVargjetDocument(formData: FormData) {
  const topicIdRaw = formData.get("topicId")?.toString().trim() ?? "";
  const topicId = Number.parseInt(topicIdRaw, 10);
  const titleRaw = formData.get("title")?.toString().trim() ?? "";
  const file = formData.get("file");

  if (Number.isNaN(topicId)) {
    redirect("/admin/vargjet-e-lira?docError=topic");
  }

  const topic = await prisma.vargjetTopic.findUnique({ where: { id: topicId } });
  if (!topic) {
    redirect("/admin/vargjet-e-lira?docError=topic");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/vargjet-e-lira?docError=file");
  }

  if (file.size > VARGJET_MAX_FILE_BYTES) {
    redirect("/admin/vargjet-e-lira?docError=size");
  }

  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedVargjetMime(mimeType)) {
    redirect("/admin/vargjet-e-lira?docError=mime");
  }

  const originalFileName = file.name.trim() || "document";
  const title =
    titleRaw ||
    originalFileName.replace(/\.[^/.]+$/, "") ||
    originalFileName;

  const buf = Buffer.from(await file.arrayBuffer());

  await prisma.vargjetDocument.create({
    data: {
      topicId,
      title,
      originalFileName,
      mimeType,
      fileData: buf,
    },
  });

  revalidateVargjet();
  revalidatePath(`/projekte/kultura/vargjet-e-lira/${topic.slug}`);
  redirect("/admin/vargjet-e-lira?docOk=1");
}

export async function deleteVargjetTopic(formData: FormData) {
  const idRaw = formData.get("topicId")?.toString().trim() ?? "";
  const id = Number.parseInt(idRaw, 10);
  if (Number.isNaN(id)) {
    redirect("/admin/vargjet-e-lira?delError=1");
  }

  const topic = await prisma.vargjetTopic.findUnique({ where: { id } });
  if (!topic) {
    redirect("/admin/vargjet-e-lira?delError=1");
  }

  await prisma.vargjetTopic.delete({ where: { id } });

  revalidateVargjet();
  revalidatePath(`/projekte/kultura/vargjet-e-lira/${topic.slug}`);
  redirect("/admin/vargjet-e-lira?delTopicOk=1");
}

export async function deleteVargjetDocument(formData: FormData) {
  const idRaw = formData.get("documentId")?.toString().trim() ?? "";
  const id = Number.parseInt(idRaw, 10);
  if (Number.isNaN(id)) {
    redirect("/admin/vargjet-e-lira?delError=1");
  }

  const doc = await prisma.vargjetDocument.findUnique({
    where: { id },
    include: { topic: true },
  });
  if (!doc) {
    redirect("/admin/vargjet-e-lira?delError=1");
  }

  await prisma.vargjetDocument.delete({ where: { id } });

  revalidateVargjet();
  revalidatePath(`/projekte/kultura/vargjet-e-lira/${doc.topic.slug}`);
  redirect("/admin/vargjet-e-lira?delDocOk=1");
}
