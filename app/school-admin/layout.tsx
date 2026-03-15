import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantNavbar } from "@/components/tenant/tenant-navbar";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <TenantSidebar />
      <div className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        <TenantNavbar />
        <main className="pb-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
