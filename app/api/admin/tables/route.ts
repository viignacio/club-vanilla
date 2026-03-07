import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

function isAdmin(request: NextRequest) {
  return request.cookies.get("cv_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }

  return NextResponse.json({ tables: data });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const secret_key = crypto.randomUUID();

  const { data, error } = await supabase
    .from("tables")
    .insert({ name: name.trim(), secret_key })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 });
  }

  return NextResponse.json({ table: data }, { status: 201 });
}
