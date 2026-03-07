import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, ORDER_SESSION_COOKIE } from "@/lib/supabase/session";
import { client } from "@/sanity/lib/client";
import { orderMenuQuery } from "@/sanity/lib/queries";
import OrderEntry from "@/components/order/OrderEntry";
import OrderUI from "@/components/order/OrderUI";
import type { OrderMenuSection } from "@/lib/types/order";

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

  // Valid session — fetch menu and show order UI
  if (session) {
    const menuSections: OrderMenuSection[] = await client.fetch(orderMenuQuery, {}, { next: { revalidate: 300 } });
    return <OrderUI session={session} menuSections={menuSections} />;
  }

  // No session — need QR params to establish one
  if (!params.table || !params.key) {
    redirect("/order/invalid");
  }

  // Has QR params — let client component handle validation + cookie setting
  return <OrderEntry tableId={params.table} secretKey={params.key} />;
}
