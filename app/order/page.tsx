import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, ORDER_SESSION_COOKIE } from "@/lib/supabase/session";
import { supabase } from "@/lib/supabase/client";
import { client } from "@/sanity/lib/client";
import { orderMenuQuery, adminLogoQuery } from "@/sanity/lib/queries";
import OrderEntry from "@/components/order/OrderEntry";
import OrderUI from "@/components/order/OrderUI";
import type { OrderMenuCategory } from "@/lib/types/order";

export const metadata = {
  title: "Order",
  robots: "noindex, nofollow",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; key?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ORDER_SESSION_COOKIE)?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;

  // QR params take priority — always create a fresh session when scanning
  if (params.table && params.key) {
    return <OrderEntry tableId={params.table} secretKey={params.key} />;
  }

  // No QR params — require a valid existing session
  if (!session) {
    redirect("/order/invalid");
  }

  // Valid session — fetch menu and show order UI
  const [categories, tableRow, logoUrl] = await Promise.all([
    client.fetch<OrderMenuCategory[]>(orderMenuQuery, {}, { next: { revalidate: 300 } }),
    supabase.from("tables").select("name").eq("id", session.tableId).single(),
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
  ]);
  const freshSession = tableRow.data?.name
    ? { ...session, tableName: tableRow.data.name }
    : session;
  return <OrderUI session={freshSession} categories={categories} logoUrl={logoUrl ?? undefined} />;
}
