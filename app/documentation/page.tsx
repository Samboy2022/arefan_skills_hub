import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Book, ChevronRight, MonitorPlay, FileCheck, CheckCircle, Users } from 'lucide-react'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              FnSkills Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive guides to help you navigate and master the platform. Currently highlighting the Student and Instructor Dashboard flows.
            </p>
          </div>
        </section>

        {/* Documentation Content Layout */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-bold text-lg mb-4">Contents</h3>
                <nav className="space-y-1">
                  <DocNavLink active title="Student Dashboard" icon={Book} />
                  <div className="pl-6 space-y-1 border-l border-border ml-3 mt-1 mb-4">
                    <DocSubLink title="1. Logging In" />
                    <DocSubLink title="2. The Learning Hub" />
                    <DocSubLink title="3. Submitting Assignments" />
                    <DocSubLink title="4. Taking Quizzes" />
                    <DocSubLink title="5. Community Forums" />
                  </div>

                  <DocNavLink active title="Instructor Guide" icon={MonitorPlay} />
                  <div className="pl-6 space-y-1 border-l border-border ml-3 mt-1">
                    <DocSubLink title="1. Course Builder" />
                    <DocSubLink title="2. Live Classes" />
                    <DocSubLink title="3. Assessments & Quizzes" />
                    <DocSubLink title="4. Automated Gradebook" />
                    <DocSubLink title="5. Schedule Management" />
                    <DocSubLink title="6. Student Engagement" />
                  </div>

                  <div className="pt-4">
                    <DocNavLink title="Admin Settings" icon={FileCheck} />
                    <DocNavLink title="API Reference" icon={CheckCircle} />
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Student Dashboard Flow</h2>

                {/* Step 1 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                    <h3 className="text-2xl font-semibold m-0">Logging In</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Access your institution's custom subdomain (e.g., <code>academy.yourschool.com</code>). Enter the credentials provided by your administrator. If SSO is enabled, click "Login with Organization."
                  </p>
                  <PlaceholderImage text="Screenshot: Login Screen (Institutional Branding)" />
                </div>

                {/* Step 2 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                    <h3 className="text-2xl font-semibold m-0">The Learning Hub</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Upon login, you arrive at the Learning Hub. This is your central dashboard showing active courses, upcoming deadlines, and overall progress. Click on any course card to enter the interactive lesson viewer.
                  </p>
                  <PlaceholderImage text="Screenshot: Student Dashboard overview showing course cards and calendar" />
                </div>

                {/* Step 3 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                    <h3 className="text-2xl font-semibold m-0">Submitting Assignments</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Navigate to the "Assignments" tab within a course. Read the instructions, and use the upload widget to attach your files. You can submit documents, code files, or external links depending on the instructor's requirements.
                  </p>
                  <PlaceholderImage text="Screenshot: Assignment submission form with drag-and-drop file upload" />
                </div>

                {/* Step 4 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                    <h3 className="text-2xl font-semibold m-0">Taking Quizzes</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Quizzes are often timed. Once you click "Start Quiz," a timer will appear. Answer multiple-choice, short-answer, or essay questions. Your progress is auto-saved. Click "Submit" when finished to receive instant grades for objective questions.
                  </p>
                  <PlaceholderImage text="Screenshot: Active quiz interface showing timer and question navigation" />
                </div>

                {/* Step 5 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                    <h3 className="text-2xl font-semibold m-0">Community Forums</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Learning is collaborative. Access the "Discussions" tab to ask questions, share insights, and reply to peers. Instructors often use this space for announcements and active Q&A.
                  </p>
                  <PlaceholderImage text="Screenshot: Course discussion forum showing threaded replies" />
                </div>


                <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8 mt-24">Instructor Guide Flow</h2>

                {/* Step 1 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                    <h3 className="text-2xl font-semibold m-0">Course Builder</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Use the drag-and-drop course builder to create modules, lessons, and assignments. Upload multimedia content, embed external videos, and structure your curriculum without writing any code.
                  </p>
                  <PlaceholderImage text="Screenshot: Drag-and-drop interface of the Course Builder" />
                </div>

                {/* Step 2 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                    <h3 className="text-2xl font-semibold m-0">Live Classes</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Schedule and launch live sessions directly from your dashboard. Integrated with Zoom and Google Meet, the system automatically sends invites and records attendance.
                  </p>
                  <PlaceholderImage text="Screenshot: Live class scheduling interface with Zoom integration" />
                </div>

                {/* Step 3 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                    <h3 className="text-2xl font-semibold m-0">Assessments & Quizzes</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Create comprehensive assessments with varied question types (multiple-choice, essay, true/false). Set time limits, passing grades, and automated feedback mechanisms.
                  </p>
                  <PlaceholderImage text="Screenshot: Quiz creation tool showing question type selection" />
                </div>

                {/* Step 4 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                    <h3 className="text-2xl font-semibold m-0">Automated Gradebook</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    All quiz scores are automatically synced to the centralized gradebook. Manually review and grade essay submissions or file uploads with our built-in rubric grading tool.
                  </p>
                  <PlaceholderImage text="Screenshot: Centralized instructor gradebook showing student scores" />
                </div>

                {/* Step 5 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                    <h3 className="text-2xl font-semibold m-0">Schedule Management</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Maintain your academic calendar. Block out office hours, set assignment deadlines, and manage live class schedules that automatically reflect on your students' dashboards.
                  </p>
                  <PlaceholderImage text="Screenshot: Instructor calendar view for managing deadlines and office hours" />
                </div>

                {/* Step 6 */}
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">6</div>
                    <h3 className="text-2xl font-semibold m-0">Student Engagement Tools</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Send direct messages, post global course announcements, and moderate discussion forums to keep your students engaged and informed throughout the semester.
                  </p>
                  <PlaceholderImage text="Screenshot: Course announcement creation and messaging interface" />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-border pt-8 mt-12">
                  <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Student Dashboard
                  </button>
                  <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                    Admin Settings <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function DocNavLink({ title, icon: Icon, active = false }: { title: string, icon?: any, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-sm">{title}</span>
    </a>
  )
}

function DocSubLink({ title, active = false }: { title: string, active?: boolean }) {
  return (
    <a href="#" className={`block px-3 py-1.5 text-sm transition-colors ${active ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
      {title}
    </a>
  )
}

function PlaceholderImage({ text }: { text: string }) {
  return (
    <Card className="border-dashed border-2 border-border/50 bg-muted/20 overflow-hidden">
      <CardContent className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
        <MonitorPlay className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground font-mono bg-background p-2 rounded border border-border">{text}</p>
      </CardContent>
    </Card>
  )
}
