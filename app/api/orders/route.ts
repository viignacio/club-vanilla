import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { verifySession, ORDER_SESSION_COOKIE } from "@/lib/supabase/session";
import type { CartItem } from "@/lib/supabase/types";

// POST /api/orders — place a new order (requires valid order session cookie)
export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(ORDER_SESSION_COOKIE)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySession(sessionToken);
  if (!session) {
    return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
  }

  const body = await request.json();
  const items: CartItem[] = body.items ?? [];
  const note: string | null = body.note ?? null;

  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  for (const item of items) {
    if (!item.item_key || !item.item_name_en || typeof item.price !== "number" || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      table_id: session.tableId,
      session_id: session.sessionId,
      status: "pending",
      note,
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // Insert order items
  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      item_key: item.item_key,
      item_name_en: item.item_name_en,
      item_name_ja: item.item_name_ja ?? null,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    console.error("Failed to create order items:", itemsError);
    // Roll back order
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}

// GET /api/orders — list orders (admin only, verified via admin session cookie)
export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("cv_admin")?.value;
  if (adminSession !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get("tableId");
  const status = searchParams.get("status");

  let query = supabase
    .from("orders")
    .select(`
      *,
      table:tables(id, name),
      items:order_items(*)
    `)
    .order("created_at", { ascending: false });

  if (tableId) query = query.eq("table_id", tableId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
