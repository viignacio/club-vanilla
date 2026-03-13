import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/supabase/types";
import { verifyAdminCookie, getAdminTokenPayload } from "@/app/api/admin-auth/route";

// PATCH /api/orders/[id] — update order status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("cv_admin")?.value;
  if (!(await verifyAdminCookie(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getAdminTokenPayload(token);
  const actingUsername = payload?.username ?? null;

  const { id } = await params;
  const body = await request.json();
  const status: OrderStatus = body.status;
  const authorizedBy: string | null = body.authorized_by ?? null;

  if (!["pending", "done", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "done") {
    updateData.completed_by = actingUsername;
  } else if (status === "cancelled") {
    updateData.canceled_by = actingUsername;
    updateData.authorized_by = authorizedBy ?? actingUsername;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
