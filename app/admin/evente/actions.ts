"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isEventEditionYear } from "@/lib/event-editions";
import { prisma } from "@/lib/db";
import {
  EVENT_GALLERY_MAX_BYTES,
  isAllowedEventGalleryMime,
} from "@/lib/event-gallery-upload";
import { isEventSlug } from "@/lib/event-slugs";

export async function uploadEventGalleryImage(formData: FormData) {
  const eventSlug = formData.get("eventSlug")?.toString().trim() ?? "";
  const editionYearRaw = formData.get("editionYear")?.toString().trim() ?? "";
  const editionYear = Number.parseInt(editionYearRaw, 10);
  const file = formData.get("file");

  if (!isEventSlug(eventSlug)) {
    redirect("/admin/evente?error=slug");
  }

  if (!isEventEditionYear(editionYear)) {
    redirect("/admin/evente?error=year");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/evente?error=file&event=${encodeURIComponent(eventSlug)}`);
  }

  if (file.size > EVENT_GALLERY_MAX_BYTES) {
    redirect(`/admin/evente?error=size&event=${encodeURIComponent(eventSlug)}`);
  }

  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedEventGalleryMime(mimeType)) {
    redirect(`/admin/evente?error=mime&event=${encodeURIComponent(eventSlug)}`);
  }

  const maxOrder = await prisma.eventGalleryImage.aggregate({
    where: { eventSlug, editionYear },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  const buf = Buffer.from(await file.arrayBuffer());

  await prisma.eventGalleryImage.create({
    data: {
      eventSlug,
      editionYear,
      sortOrder,
      mimeType,
      fileData: buf,
    },
  });

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
    select: { eventSlug: true, editionYear: true },
  });
  if (!row) {
    redirect("/admin/evente?error=del");
  }

  await prisma.eventGalleryImage.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/evente/${row.eventSlug}`);
  revalidatePath(`/evente/${row.eventSlug}/${row.editionYear}`);
  redirect(`/admin/evente?delOk=1&event=${encodeURIComponent(row.eventSlug)}&year=${row.editionYear}`);
}
