import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import { getAdminTokenPayload } from "@/app/api/admin-auth/route";

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cv_admin")?.value;
  const payload = await getAdminTokenPayload(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newUsername, newPassword } = await request.json();

  if (!currentPassword) {
    return NextResponse.json({ error: "currentPassword is required" }, { status: 400 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, password_hash")
    .eq("id", payload.sub)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect current password" }, { status: 403 });
  }

  const updates: Record<string, string> = {};
  if (newUsername?.trim()) updates.username = newUsername.trim();
  if (newPassword) updates.password_hash = await bcrypt.hash(newPassword, 12);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase.from("users").update(updates).eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
