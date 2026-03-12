import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";

const ADMIN_COOKIE = "cv_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const { data: user, error: dbError } = await supabase
    .from("users")
    .select("id, username, password_hash, role")
    .eq("username", username)
    .single();

  if (dbError) {
    console.error("[admin-auth] DB error:", dbError.message);
    return NextResponse.json({ error: "DB error: " + dbError.message }, { status: 500 });
  }

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ sub: user.id, role: user.role, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export async function verifyAdminCookie(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminTokenPayload(
  token: string | undefined
): Promise<{ sub: string; role: string; username?: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null;
    return {
      sub: payload.sub,
      role: payload.role,
      username: typeof payload.username === "string" ? payload.username : undefined,
    };
  } catch {
    return null;
  }
}

export async function getUsername(): Promise<string | undefined> {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("cv_admin")?.value;
  const payload = await getAdminTokenPayload(token);
  return payload?.username;
}
