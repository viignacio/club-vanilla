import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Admin" };
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername, getRole } from "@/app/api/admin-auth/route";
import OrderFeed from "@/components/admin/OrderFeed";
import type { Order } from "@/lib/supabase/types";
import type { Table } from "@/lib/supabase/types";

function currentBusinessDate(): string {
  const shifted = new Date(Date.now() - 11 * 60 * 60 * 1000);
  return shifted.toISOString().split("T")[0];
}

export default async function AdminDashboardPage() {
  const [ordersResult, tablesResult, logoUrl, username, role] = await Promise.all([
    supabase
      .from("orders")
      .select("*, table:tables(id, name), items:order_items(*)")
      .eq("business_date", currentBusinessDate())
      .order("created_at", { ascending: false }),
    supabase
      .from("tables")
      .select("id, name, secret_key")
      .order("created_at", { ascending: true }),
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
    getRole(),
  ]);

  const orders = (ordersResult.data ?? []) as Order[];
  const tables = (tablesResult.data ?? []) as Pick<Table, "id" | "name" | "secret_key">[];
  const userRole = (role === "crew" ? "crew" : "admin") as "admin" | "crew";

  return (
    <OrderFeed
      initialOrders={orders}
      tables={tables}
      logoUrl={logoUrl ?? undefined}
      username={username}
      role={userRole}
    />
  );
}
