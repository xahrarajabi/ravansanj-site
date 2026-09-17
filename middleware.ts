import { NextRequest, NextResponse } from "next/server";
import { GUEST_COOKIE, SESSION_COOKIE } from "@/lib/auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/social",
  "/chat",
  "/settings",
  "/invites",
  "/reports",
  "/growth-path",
  "/pricing/checkout",
  "/profile",
];

/** Catalog tests require login; personality guest flow is public */
function isProtectedPath(pathname: string) {
  if (pathname === "/test" || pathname.startsWith("/test/")) {
    // Allow nothing under /test without auth (catalog only lives here)
    return true;
  }
  if (pathname === "/result" || pathname.startsWith("/result/")) {
    return true;
  }
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);

  // Ensure guest id for personality / extra tests
  let guestId = req.cookies.get(GUEST_COOKIE)?.value;
  const resCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];
  if (!guestId) {
    guestId = crypto.randomUUID();
    resCookies.push({
      name: GUEST_COOKIE,
      value: guestId,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
        secure: process.env.NODE_ENV === "production",
      },
    });
  }
  requestHeaders.set("x-guest-id", guestId);

  if (isProtectedPath(pathname)) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      const redirect = NextResponse.redirect(url);
      for (const c of resCookies) {
        redirect.cookies.set(c.name, c.value, c.options);
      }
      return redirect;
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  for (const c of resCookies) {
    res.cookies.set(c.name, c.value, c.options);
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
