import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function StudentDashboardDoc() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Dashboard & Login</h2>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Logging In</h3>
        <p className="text-muted-foreground mb-6">
          Access your institution's custom subdomain (e.g., <code>academy.yourschool.com</code>). Enter the credentials provided by your administrator. If SSO is enabled, click "Login with Organization."
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Login Screen</span>
          <p>Visual representation of institutional branded login</p>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">The Learning Hub (Dashboard)</h3>
        <p className="text-muted-foreground mb-6">
          Upon login, you arrive at the Learning Hub. This is your central dashboard showing active courses, upcoming deadlines, and overall progress. Click on any course card to enter the interactive lesson viewer.
        </p>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[400px]">
          <span className="bg-background px-3 py-1 rounded-md shadow-sm border border-border text-sm font-mono mb-4">Screenshot: Learning Hub</span>
          <p>Dashboard overview showing course cards, calendar, and quick stats</p>
        </Card>
      </div>

      {/* Pagination */}
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <div /> {/* Empty space for flex alignment */}
        <Link href="/documentation/student/assignments" className="flex items-center gap-2 text-primary hover:underline font-medium">
          Next: Submitting Assignments <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
