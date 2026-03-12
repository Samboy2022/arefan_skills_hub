import { InstructorSidebar } from "@/components/instructor/instructor-sidebar";
import { InstructorNavbar } from "@/components/instructor/instructor-navbar";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <InstructorNavbar />

        {/* Page Content */}
        <main className="pt-24 pl-20 lg:pl-64 pr-6 pb-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
