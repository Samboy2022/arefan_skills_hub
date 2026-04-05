import { SchoolAdminLayoutClient } from "@/components/tenant/school-admin-layout-client";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SchoolAdminLayoutClient>{children}</SchoolAdminLayoutClient>;
}
