import { Mail, MessageCircle, Eye, MoreHorizontal, Search } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_STUDENTS, MOCK_GRADES } from "@/lib/instructor-mock-data";
import { STUDENT_STATUS } from "@/lib/instructor-constants";

export default function StudentsPage() {
  const getStudentStatus = (status: string) => {
    const statusInfo = STUDENT_STATUS.find((s) => s.id === status);
    return statusInfo || STUDENT_STATUS[0];
  };

  const getStudentAvgGrade = (studentId: string) => {
    const grades = MOCK_GRADES.filter((g) => g.studentId === studentId);
    if (grades.length === 0) return 0;
    const avgScore = grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length;
    return Math.round(avgScore);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Students"
        description="Manage and monitor student progress in your courses"
      >
        <Button>Export CSV</Button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
          />
        </div>
        <Button variant="outline">Filter by Status</Button>
      </div>

      {/* Students Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Avg Grade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Activity</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_STUDENTS.map((student) => {
                const statusInfo = getStudentStatus(student.status);
                const avgGrade = getStudentAvgGrade(student.id);
                const lastActivityText = student.lastActivity
                  ? student.lastActivity.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Never";

                return (
                  <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{avgGrade}%</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lastActivityText}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Mail className="h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Submissions</DropdownMenuItem>
                          <DropdownMenuItem>View Grades</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
