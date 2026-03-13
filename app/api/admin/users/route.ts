import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import { getAdminTokenPayload } from "@/app/api/admin-auth/route";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cv_admin")?.value;
  const payload = await getAdminTokenPayload(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET() {
  const payload = await requireAdmin();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("id, username, role")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/users] DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(request: NextRequest) {
  const payload = await requireAdmin();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, password, role } = await request.json();

  if (!username?.trim() || !password || !role) {
    return NextResponse.json({ error: "username, password, and role are required" }, { status: 400 });
  }

  if (role !== "admin" && role !== "crew") {
    return NextResponse.json({ error: "role must be admin or crew" }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("users")
    .insert({ username: username.trim(), password_hash, role })
    .select("id, username, role")
    .single();

  if (error) {
    console.error("[admin/users] DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data }, { status: 201 });
}
