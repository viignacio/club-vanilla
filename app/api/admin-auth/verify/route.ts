import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";

// Verifies that the provided credentials belong to an admin user.
// Does NOT set a cookie — used by crew members to authorize sensitive actions.
export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const { data: user, error: dbError } = await supabase
    .from("users")
    .select("id, password_hash, role")
    .eq("username", username)
    .single();

  if (dbError) {
    console.error("[admin-auth/verify] DB error:", dbError.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
