import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { adminLogoQuery } from "@/sanity/lib/queries";
import { getUsername } from "@/app/api/admin-auth/route";
import CredentialsManager from "@/components/admin/CredentialsManager";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const [logoUrl, username] = await Promise.all([
    client.fetch<string | null>(adminLogoQuery).catch(() => null),
    getUsername(),
  ]);
  return <CredentialsManager logoUrl={logoUrl ?? undefined} username={username} />;
}
