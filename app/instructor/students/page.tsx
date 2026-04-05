import { Mail, MessageCircle, Eye, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
    <div className="mx-auto max-w-6xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Breadcrumb 
          showHome={false}
          items={[
            { label: "Dashboard", href: "/instructor" },
            { label: "Students" }
          ]} 
        />
      </div>

      <div className="pt-4 pb-4">
        <PageHeader
          title="Students"
          description="Manage and monitor student progress in your courses"
        >
          <Button className="shadow-sm">Export CSV</Button>
        </PageHeader>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 py-2 flex-1 max-w-md shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
          />
        </div>
        <Button variant="outline" className="shadow-sm">Filter by Status</Button>
      </div>

      {/* Students Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[30%]">Student</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Avg Grade</TableHead>
              <TableHead className="font-semibold">Last Activity</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STUDENTS.map((student) => {
              const statusInfo = getStudentStatus(student.status);
              const avgGrade = getStudentAvgGrade(student.id);
              const lastActivityText = student.lastActivity
                ? student.lastActivity.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Never";

              return (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.studentId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent ${statusInfo.color}`}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {avgGrade}%
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lastActivityText}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild className="h-8 shadow-none text-xs font-medium">
                        <Link href={`/instructor/students/${student.id}`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Profile
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="h-8 shadow-none text-xs font-medium">
                        <Link href={`/instructor/students/${student.id}/message`}>
                          <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Message
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" asChild>
                            <a href={`mailto:${student.email}`}>
                              <Mail className="h-4 w-4" />
                              Send Email
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/instructor/students/${student.id}/submissions`}>
                              View Submissions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/instructor/students/${student.id}/grades`}>
                              View Grades
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
