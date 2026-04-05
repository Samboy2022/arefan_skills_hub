import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_STUDENTS } from "@/lib/instructor-mock-data";

export default function MessageStudentPage({ params }: { params: { studentId: string } }) {
  const student = MOCK_STUDENTS.find(s => s.id === params.studentId) || MOCK_STUDENTS[0];

  return (
    <div className="mx-auto max-w-6xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Students", href: "/instructor/students" },
          { label: student.name, href: `/instructor/students/${params.studentId}` },
          { label: "Message" }
        ]} 
      />
      <div className="pt-4 pb-4">
        <PageHeader title={`Message ${student.name}`} description="Send a direct message to this student." />
      </div>
      <div className="p-6 bg-card rounded-md border space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Message</label>
          <Textarea placeholder="Type your message here..." className="min-h-[150px]" />
        </div>
        <Button>Send Message</Button>
      </div>
    </div>
  );
}