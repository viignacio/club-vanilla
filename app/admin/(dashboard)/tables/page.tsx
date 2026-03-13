import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Tables" };
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername, getRole } from "@/app/api/admin-auth/route";
import TableManager from "@/components/admin/TableManager";
import type { Table } from "@/lib/supabase/types";

export default async function AdminTablesPage() {
  const role = await getRole();
  if (role !== "admin") redirect("/admin");

  const [{ data }, logoUrl, username] = await Promise.all([
    supabase.from("tables").select("*").order("created_at", { ascending: true }),
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
  ]);

  const tables = (data ?? []) as Table[];

  return <TableManager initialTables={tables} logoUrl={logoUrl ?? undefined} username={username} role="admin" />;
}
