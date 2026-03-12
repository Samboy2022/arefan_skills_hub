import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { TenantNavbar } from "@/components/tenant/tenant-navbar";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <TenantSidebar />
      <div className="flex-1 md:ml-64 ml-20 transition-all duration-300">
        <TenantNavbar />
        <main className="pt-20 pb-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
