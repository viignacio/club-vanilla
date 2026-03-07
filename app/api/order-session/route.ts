import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { signSession, ORDER_SESSION_COOKIE } from "@/lib/supabase/session";

// POST /api/order-session
// Called when a customer lands on /order with valid QR params (table + key).
// Validates the table secret, then sets a signed 12h session cookie.
//
// Body: { tableId: string, key: string, sessionId: string }
//   sessionId — random UUID generated client-side and stored in localStorage.
//   Passing it from the client ensures the same device always gets the same sessionId
//   even after the cookie expires and they re-scan the QR.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tableId, key, sessionId } = body;

  if (!tableId || !key || !sessionId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Validate table + secret against DB
  const { data: table, error } = await supabase
    .from("tables")
    .select("id, name, secret_key")
    .eq("id", tableId)
    .eq("secret_key", key)
    .single();

  if (error || !table) {
    return NextResponse.json({ error: "Invalid QR code" }, { status: 403 });
  }

  const token = await signSession({
    tableId: table.id,
    tableName: table.name,
    sessionId,
  });

  const response = NextResponse.json({ ok: true, tableName: table.name });

  response.cookies.set(ORDER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60, // 12 hours
  });

  return response;
}
