import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function StudentAssignmentsDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Submitting Assignments</h2>

      <p className="text-lg text-muted-foreground mb-8">
        The Assignment feature allows you to submit your work directly to your instructors for grading. Here is the complete workflow from viewing to getting feedback.
      </p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">1. Viewing the Assignment</h3>
        <p className="text-muted-foreground mb-6">
          Navigate to the "Assignments" tab within a course. Here you will see the instructions, due date, and grading rubric.
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">2. Uploading Your Work</h3>
        <p className="text-muted-foreground mb-6">
          Use the upload widget to attach your files. You can submit documents (PDF, DOCX), code files, or external links depending on the instructor's requirements.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Upload Widget</span>
          <p>Drag-and-drop file upload interface</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">3. Editing and Resubmitting</h3>
        <p className="text-muted-foreground mb-6">
          If the deadline has not passed, you can click "Edit Submission" to replace files or update your submission notes.
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">4. Viewing Feedback and Grades</h3>
        <p className="text-muted-foreground mb-6">
          Once graded, you will receive a notification. Return to the assignment page to view your score and read the instructor's inline comments and feedback.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/student/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium">
          <ChevronLeft className="h-4 w-4" /> Previous: Dashboard & Login
        </Link>
        <Link href="/documentation/student/quizzes" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Taking Quizzes <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
