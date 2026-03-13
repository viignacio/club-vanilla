import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername, getRole } from "@/app/api/admin-auth/route";
import OrderHistory from "@/components/admin/OrderHistory";

export const metadata: Metadata = { title: "Order History" };

export default async function AdminHistoryPage() {
  const [logoUrl, username, role] = await Promise.all([
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
    getRole(),
  ]);

  const userRole = role === "crew" ? "crew" : "admin";

  return <OrderHistory logoUrl={logoUrl ?? undefined} username={username} role={userRole} />;
}
