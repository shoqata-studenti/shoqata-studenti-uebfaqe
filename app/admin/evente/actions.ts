"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isEventEditionYear } from "@/lib/event-editions";
import { prisma } from "@/lib/db";
import {
  isAllowedEventGalleryMime,
  maxBytesForEventGalleryMime,
} from "@/lib/event-gallery-upload";
import { isEventSlug } from "@/lib/event-slugs";

const SLIDESHOW_MAX_FILES = 20;

export async function uploadEventGalleryImage(formData: FormData) {
  const eventSlug = formData.get("eventSlug")?.toString().trim() ?? "";
  const editionYearRaw = formData.get("editionYear")?.toString().trim() ?? "";
  const editionYear = Number.parseInt(editionYearRaw, 10);
  const slideshowMode = formData.get("galleryMode")?.toString() === "slideshow";

  if (!isEventSlug(eventSlug)) {
    redirect("/admin/evente?error=slug");
  }

  if (!isEventEditionYear(editionYear)) {
    redirect("/admin/evente?error=year");
  }

  const files = formData
    .getAll("file")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length === 0) {
    redirect(`/admin/evente?error=file&event=${encodeURIComponent(eventSlug)}`);
  }

  if (slideshowMode && files.length < 2) {
    redirect(
      `/admin/evente?error=slideshow&event=${encodeURIComponent(eventSlug)}&year=${encodeURIComponent(String(editionYear))}`
    );
  }

  if (!slideshowMode && files.length > 1) {
    redirect(
      `/admin/evente?error=single&event=${encodeURIComponent(eventSlug)}&year=${encodeURIComponent(String(editionYear))}`
    );
  }

  if (files.length > SLIDESHOW_MAX_FILES) {
    redirect(
      `/admin/evente?error=count&event=${encodeURIComponent(eventSlug)}&year=${encodeURIComponent(String(editionYear))}`
    );
  }

  for (const file of files) {
    const mimeType = file.type || "application/octet-stream";
    if (!isAllowedEventGalleryMime(mimeType)) {
      redirect(`/admin/evente?error=mime&event=${encodeURIComponent(eventSlug)}`);
    }
    const cap = maxBytesForEventGalleryMime(mimeType);
    if (file.size > cap) {
      redirect(`/admin/evente?error=size&event=${encodeURIComponent(eventSlug)}`);
    }
  }

  const maxOrder = await prisma.eventGalleryImage.aggregate({
    where: { eventSlug, editionYear },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;
  const groupId = slideshowMode ? randomUUID() : null;

  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const mimeType = file.type || "application/octet-stream";
    const buf = Buffer.from(await file.arrayBuffer());
    await prisma.eventGalleryImage.create({
      data: {
        eventSlug,
        editionYear,
        sortOrder,
        slideshowGroupId: groupId,
        slideshowIndex: slideshowMode ? i : 0,
        mimeType,
        fileData: buf,
      },
    });
  }

  revalidatePath("/");
  revalidatePath(`/evente/${eventSlug}`);
  revalidatePath(`/evente/${eventSlug}/${editionYear}`);
  redirect(`/admin/evente?ok=1&event=${encodeURIComponent(eventSlug)}&year=${editionYear}`);
}

export async function deleteEventGalleryImage(formData: FormData) {
  const idRaw = formData.get("id")?.toString().trim() ?? "";
  const id = Number.parseInt(idRaw, 10);
  if (Number.isNaN(id)) {
    redirect("/admin/evente?error=del");
  }

  const row = await prisma.eventGalleryImage.findUnique({
    where: { id },
    select: {
      eventSlug: true,
      editionYear: true,
      slideshowGroupId: true,
      sortOrder: true,
    },
  });
  if (!row) {
    redirect("/admin/evente?error=del");
  }

  await prisma.eventGalleryImage.delete({ where: { id } });

  if (row.slideshowGroupId) {
    const siblings = await prisma.eventGalleryImage.findMany({
      where: {
        eventSlug: row.eventSlug,
        editionYear: row.editionYear,
        slideshowGroupId: row.slideshowGroupId,
        sortOrder: row.sortOrder,
      },
      orderBy: [{ slideshowIndex: "asc" }, { id: "asc" }],
      select: { id: true },
    });

    if (siblings.length === 1) {
      await prisma.eventGalleryImage.update({
        where: { id: siblings[0]!.id },
        data: { slideshowGroupId: null, slideshowIndex: 0 },
      });
    } else if (siblings.length > 1) {
      await prisma.$transaction(
        siblings.map((s, idx) =>
          prisma.eventGalleryImage.update({
            where: { id: s.id },
            data: { slideshowIndex: idx },
          })
        )
      );
    }
  }

  revalidatePath("/");
  revalidatePath(`/evente/${row.eventSlug}`);
  revalidatePath(`/evente/${row.eventSlug}/${row.editionYear}`);
  redirect(`/admin/evente?delOk=1&event=${encodeURIComponent(row.eventSlug)}&year=${row.editionYear}`);
}
