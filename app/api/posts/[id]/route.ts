import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/**
 * DELETE /api/posts/[id] — vetëm me cookie admin të vlefshëm.
 * Përdoret nga paneli admin me `fetch(..., { method: "DELETE", credentials: "include" })`.
 */
export async function DELETE(_request: Request, context: Ctx) {
  const jar = await cookies();
  if (!isValidAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: raw } = await context.params;
  const postId = Number.parseInt(raw, 10);
  if (Number.isNaN(postId) || postId < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, cardLinkPath: true },
  });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  if (post.cardLinkPath) {
    revalidatePath(post.cardLinkPath);
  }

  return NextResponse.json({ ok: true });
}
