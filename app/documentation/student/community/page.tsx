import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function StudentCommunityDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Community Forums</h2>

      <p className="text-lg text-muted-foreground mb-8">
        Learning is collaborative. The community forums allow you to discuss course material, ask questions, and share insights with your peers and instructors.
      </p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Participating in Discussions</h3>
        <p className="text-muted-foreground mb-6">
          Access the "Discussions" tab within a course. You can reply to existing threads created by your instructor or start a new topic.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Discussion Forum</span>
          <p>Course discussion forum showing threaded replies</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Direct Messaging</h3>
        <p className="text-muted-foreground mb-6">
          You can also use the messaging system to send private messages to your instructor or classmates for specific questions or group work collaboration.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/student/quizzes" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium">
          <ChevronLeft className="h-4 w-4" /> Previous: Taking Quizzes
        </Link>
        <Link href="/documentation/instructor/course-builder" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Instructor Guide <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
