import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";
import AdminShell from "@/components/admin/AdminShell";
import { AdminUIProvider } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminUIProvider>
      <AdminShell username={session.username}>{children}</AdminShell>
    </AdminUIProvider>
  );
}
