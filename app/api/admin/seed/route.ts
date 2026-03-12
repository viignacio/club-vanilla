import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";

export async function POST() {
  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (count !== null && count > 0) {
    return NextResponse.json({ error: "Already seeded" }, { status: 409 });
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { error: "ADMIN_USERNAME and ADMIN_PASSWORD env vars are required for seeding" },
      { status: 500 }
    );
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { error } = await supabase.from("users").insert({ username, password_hash, role: "admin" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
