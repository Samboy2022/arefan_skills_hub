import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function InstructorCourseBuilderDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Course Builder</h2>

      <p className="text-lg text-muted-foreground mb-8">
        The Course Builder is the core tool for structuring your curriculum. It allows you to organize content into modules and lessons without writing any code.
      </p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Creating Modules and Lessons</h3>
        <p className="text-muted-foreground mb-6">
          Use the drag-and-drop interface to create modules (e.g., "Week 1", "Introduction") and add individual lessons within them. You can easily reorder content by dragging items.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Course Builder</span>
          <p>Drag-and-drop interface of the Course Builder</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Adding Content</h3>
        <p className="text-muted-foreground mb-6">
          Within each lesson, you can use the rich text editor to write content, upload multimedia files (PDFs, images), and embed external videos (YouTube, Vimeo).
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Publishing</h3>
        <p className="text-muted-foreground mb-6">
          Content remains in draft mode until you are ready. Use the "Publish" toggle to make modules and lessons visible to enrolled students.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/documentation/student/community" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline font-medium">
          <ChevronLeft className="h-4 w-4" /> Previous: Student Community
        </Link>
        <Link href="/documentation/instructor/live-classes" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Live Classes <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
