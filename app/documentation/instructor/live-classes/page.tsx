import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function InstructorLiveClassesDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Live Classes</h2>

      <p className="text-lg text-muted-foreground mb-8">
        Host synchronous learning sessions directly through the platform using our built-in video conferencing integrations.
      </p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Scheduling a Session</h3>
        <p className="text-muted-foreground mb-6">
          Navigate to the "Live Classes" tab. Select the date, time, and duration. The system automatically sends calendar invites to all enrolled students.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Live Class Setup</span>
          <p>Live class scheduling interface with Zoom/Google Meet integration</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Managing Attendance</h3>
        <p className="text-muted-foreground mb-6">
          Attendance is automatically recorded when students join the session through the platform link, updating your gradebook and engagement metrics.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/instructor/course-builder" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium">
          <ChevronLeft className="h-4 w-4" /> Previous: Course Builder
        </Link>
        <Link href="/documentation/instructor/assessments" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Assessments & Quizzes <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
