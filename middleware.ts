import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLang } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for studio, API routes, and static files
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
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
