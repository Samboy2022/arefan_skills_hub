import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { MOCK_STUDENTS } from "@/lib/instructor-mock-data";

export default function StudentProfilePage({ params }: { params: { studentId: string } }) {
  const student = MOCK_STUDENTS.find(s => s.id === params.studentId) || MOCK_STUDENTS[0];

  return (
    <div className="mx-auto max-w-6xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name }
        ]} 
      />
      <div className="pt-4 pb-4">
        <PageHeader title={`${student.name}'s Profile`} description={`Student ID: ${student.studentId} | ${student.email}`} />
      </div>
      <div className="p-6 bg-card rounded-md border text-center">
        <p className="text-muted-foreground">Student profile details go here.</p>
      </div>
    </div>
  );
}