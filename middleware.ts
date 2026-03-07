import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLang } from "@/lib/i18n/config";

const PREVIEW_SECRET = process.env.PREVIEW_SECRET;
const AUTH_COOKIE = "cv_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for studio, API routes, special app pages, and static files
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Auth gate — only active when PREVIEW_SECRET is set
  if (PREVIEW_SECRET) {
    const authCookie = request.cookies.get(AUTH_COOKIE)?.value;
    if (authCookie !== PREVIEW_SECRET) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Extract the lang segment from the path
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // If there's no lang segment or it's invalid, redirect to default locale
  if (!firstSegment || !isValidLang(firstSegment)) {
    const newPath = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
