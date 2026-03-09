import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCookie } from "@/app/api/admin-auth/route";

export const metadata = {
  robots: "noindex, nofollow",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cv_admin")?.value;

  if (!(await verifyAdminCookie(token))) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
