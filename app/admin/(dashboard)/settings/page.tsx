import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername, getRole } from "@/app/api/admin-auth/route";
import { supabase } from "@/lib/supabase/client";
import CredentialsManager from "@/components/admin/CredentialsManager";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const role = await getRole();
  if (role !== "admin") redirect("/admin");

  const [logoUrl, username, usersResult] = await Promise.all([
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
    supabase.from("users").select("id, username, role").order("created_at", { ascending: true }),
  ]);

  const initialUsers = (usersResult.data ?? []) as { id: string; username: string; role: string }[];

  return (
    <CredentialsManager
      logoUrl={logoUrl ?? undefined}
      username={username}
      role="admin"
      initialUsers={initialUsers}
    />
  );
}
