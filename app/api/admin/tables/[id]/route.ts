import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

function isAdmin(request: NextRequest) {
  return request.cookies.get("cv_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase.from("tables").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete table" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tables")
    .update({ name: name.trim() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update table" }, { status: 500 });
  }

  return NextResponse.json({ table: data });
}
