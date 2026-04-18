import { createHmac, timingSafeEqual } from "node:crypto";

import "server-only";

export const ADMIN_SESSION_COOKIE = "shoqata_admin";

/** Token i qëndrueshëm, i lidhur me ADMIN_PASSWORD (nuk varet nga sesioni). */
export function getAdminSessionValue(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) return "";
  return createHmac("sha256", p)
    .update("shoqata-studenti-admin")
    .digest("hex");
}

export function isValidAdminSession(value: string | undefined): boolean {
  if (value == null) return false;
  const expected = getAdminSessionValue();
  if (!expected) return false;
  if (value.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(value, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

const PWD_BUF = 1024;

function padUtf8(s: string): Buffer {
  const b = Buffer.alloc(PWD_BUF, 0);
  const src = Buffer.from(s, "utf8");
  src.copy(b, 0, 0, Math.min(src.length, PWD_BUF));
  return b;
}

/**
 * Krahason fjalëkalim me ADMIN_PASSWORD (krahasim me buffer fiks për timing).
 */
export function isCorrectAdminPassword(plain: string | undefined): boolean {
  if (plain == null) return false;
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  try {
    return timingSafeEqual(padUtf8(plain), padUtf8(secret));
  } catch {
    return false;
  }
}
