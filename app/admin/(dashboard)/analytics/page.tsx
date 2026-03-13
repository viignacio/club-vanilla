import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername, getRole } from "@/app/api/admin-auth/route";
import AnalyticsView from "@/components/admin/AnalyticsView";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const role = await getRole();
  if (role !== "admin") redirect("/admin");

  const [logoUrl, username] = await Promise.all([
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
  ]);

  return <AnalyticsView logoUrl={logoUrl ?? undefined} username={username} role="admin" />;
}
