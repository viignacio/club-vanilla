import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Tables" };
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import TableManager from "@/components/admin/TableManager";
import type { Table } from "@/lib/supabase/types";

export default async function AdminTablesPage() {
  const [{ data }, logoUrl] = await Promise.all([
    supabase.from("tables").select("*").order("created_at", { ascending: true }),
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
  ]);

  const tables = (data ?? []) as Table[];

  return <TableManager initialTables={tables} logoUrl={logoUrl ?? undefined} />;
}
