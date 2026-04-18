import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isValidAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

/**
 * Mbro rrugët /admin (përveç /admin/login).
 * Në Next.js 16+ ky skedar quhet `proxy.ts` (parapamje e `middleware.ts`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!isValidAdminSession(token)) {
      const url = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      }
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
