import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function StudentQuizzesDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Taking Quizzes</h2>

      <p className="text-lg text-muted-foreground mb-8">
        Quizzes and assessments are a core part of testing your knowledge. This guide explains how to start, navigate, and complete quizzes.
      </p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Starting a Quiz</h3>
        <p className="text-muted-foreground mb-6">
          Access the quiz from your course syllabus or the "Quizzes" tab. Pay attention to the time limit and the number of allowed attempts before clicking "Start Quiz."
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Navigating Questions</h3>
        <p className="text-muted-foreground mb-6">
          Once the quiz starts, a timer will appear at the top. You can answer multiple-choice, short-answer, or essay questions. Use the navigation sidebar to jump between questions or flag them for review.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Quiz Interface</span>
          <p>Active quiz interface showing timer and question navigation</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Submission</h3>
        <p className="text-muted-foreground mb-6">
          Your progress is auto-saved. When you reach the end, click "Submit Quiz." For objective questions (like multiple-choice), you will receive your grade instantly.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/student/assignments" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium">
          <ChevronLeft className="h-4 w-4" /> Previous: Submitting Assignments
        </Link>
        <Link href="/documentation/student/community" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Community Forums <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
