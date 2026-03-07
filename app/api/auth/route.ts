import { NextRequest, NextResponse } from "next/server";

const PREVIEW_SECRET = process.env.PREVIEW_SECRET;
const AUTH_COOKIE = "cv_auth";

export async function POST(request: NextRequest) {
  const { password, from } = await request.json();

  if (!PREVIEW_SECRET || password !== PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const redirectTo = typeof from === "string" && from.startsWith("/") ? from : "/";
  const response = NextResponse.json({ ok: true, redirectTo });

  response.cookies.set(AUTH_COOKIE, PREVIEW_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
