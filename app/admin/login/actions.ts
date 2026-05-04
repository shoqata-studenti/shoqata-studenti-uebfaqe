"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionValue,
  isCorrectAdminPassword,
} from "@/lib/admin-auth";

function safeRedirectTarget(nextParam: string | null | undefined): string {
  if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    if (!nextParam.startsWith("/admin/login")) {
      return nextParam;
    }
  }
  return "/admin";
}

export async function adminLogin(formData: FormData) {
  const password = formData.get("password");
  const nextRaw = formData.get("next");
  const next = typeof nextRaw === "string" ? nextRaw : null;

  if (typeof password !== "string" || !isCorrectAdminPassword(password)) {
    const err = new URLSearchParams();
    err.set("error", "1");
    if (next) err.set("next", next);
    redirect(`/admin/login?${err.toString()}`);
  }

  if (!process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=2");
  }

  const c = await cookies();
  c.set(ADMIN_SESSION_COOKIE, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  redirect(safeRedirectTarget(next));
}
