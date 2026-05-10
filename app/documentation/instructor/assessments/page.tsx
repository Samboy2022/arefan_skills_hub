import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function InstructorAssessmentsDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Assessments & Quizzes</h2>
      <p className="text-lg text-muted-foreground mb-8">Create comprehensive assessments to evaluate student understanding with automated grading for objective questions.</p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Quiz Creation</h3>
        <p className="text-muted-foreground mb-6">Build quizzes with varied question types including multiple-choice, true/false, and short answer. Set time limits and passing thresholds.</p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Quiz Creation Tool</span>
        </Card>
      </div>

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/instructor/live-classes" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium"><ChevronLeft className="h-4 w-4" /> Previous: Live Classes</Link>
        <Link href="/documentation/instructor/gradebook" className="flex items-center gap-2 text-primary hover:underline font-medium">Next: Gradebook <ChevronRight className="h-4 w-4" /></Link>
      </div>
    </div>
  )
}
