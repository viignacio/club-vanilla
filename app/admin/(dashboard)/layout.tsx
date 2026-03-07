import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  robots: "noindex, nofollow",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("cv_admin")?.value;

  if (!adminCookie || adminCookie !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
