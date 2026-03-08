import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Admin" };
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import OrderFeed from "@/components/admin/OrderFeed";
import type { Order } from "@/lib/supabase/types";
import type { Table } from "@/lib/supabase/types";

export default async function AdminDashboardPage() {
  const [ordersResult, tablesResult, logoUrl] = await Promise.all([
    supabase
      .from("orders")
      .select("*, table:tables(id, name), items:order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("tables")
      .select("id, name, secret_key")
      .order("created_at", { ascending: true }),
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
  ]);

  const orders = (ordersResult.data ?? []) as Order[];
  const tables = (tablesResult.data ?? []) as Pick<Table, "id" | "name" | "secret_key">[];

  return <OrderFeed initialOrders={orders} tables={tables} logoUrl={logoUrl ?? undefined} />;
}
