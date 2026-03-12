import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentNavbar } from "@/components/student/student-navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      <div className="flex-1 flex flex-col ml-64">
        <StudentNavbar />
        <main className="flex-1 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
