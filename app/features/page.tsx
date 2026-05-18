import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import {
  Building,
  GraduationCap,
  Users,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Zap,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Award,
  Video
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features — FnSkills LMS',
  description: 'Explore FnSkills features built for school administrators, instructors, and students. White-label subdomains, drag-and-drop course builder, gamified learning, and more.',
  openGraph: {
    title: 'FnSkills Features — Built for Scale',
    description: 'Comprehensive LMS tools for administrators, instructors, and students.',
  },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Features Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Scale</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the comprehensive suite of tools designed specifically for Administrators, Instructors, and Students.
            </p>
          </div>
        </section>

        {/* School Admin Dashboard Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12 border-b border-border pb-6">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">School Admin Dashboard</h2>
                <p className="text-muted-foreground">Command center for institutional oversight and management.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={LayoutDashboard}
                title="White-label Subdomain"
                description="Custom domain mapping (e.g., academy.yourschool.com) with full branding control, including logos and color schemes."
              />
              <FeatureCard
                icon={Users}
                title="User & Role Management"
                description="Easily onboard thousands of students and faculty. Assign granular roles and permissions across departments."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Curriculum Oversight"
                description="Review, approve, and manage course structures across all departments and faculty members."
              />
              <FeatureCard
                icon={Zap}
                title="Advanced Analytics"
                description="Real-time reporting on student performance, engagement metrics, revenue, and institutional health."
              />
              <FeatureCard
                icon={Settings}
                title="Global Settings"
                description="Configure academic calendars, grading scales, notification templates, and integration APIs."
              />
              <FeatureCard
                icon={FileText}
                title="Compliance & Auditing"
                description="Track administrative actions, generate compliance reports, and manage data retention policies."
              />
            </div>
          </div>
        </section>

        {/* Instructor Dashboard Features */}
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12 border-b border-border/50 pb-6">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
                <p className="text-muted-foreground">Powerful tools to create, engage, and evaluate.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={BookOpen}
                title="Drag-and-Drop Course Builder"
                description="Intuitive interface to create modules, upload multimedia lessons, and structure curriculum without coding."
              />
              <FeatureCard
                icon={Video}
                title="Live Classes & Webinars"
                description="Built-in integration for Zoom and other video conferencing tools for seamless live sessions."
              />
              <FeatureCard
                icon={FileText}
                title="Advanced Assessments"
                description="Create timed quizzes, varied question types, and comprehensive assignment rubrics."
              />
              <FeatureCard
                icon={Award}
                title="Automated Gradebook"
                description="Automatically sync quiz scores and manage manual assignment grading in a centralized gradebook."
              />
              <FeatureCard
                icon={MessageSquare}
                title="Student Engagement Tools"
                description="Direct messaging, course announcements, and moderated discussion forums."
              />
              <FeatureCard
                icon={Calendar}
                title="Schedule Management"
                description="Manage office hours, assignment deadlines, and live class schedules mapped to the academic calendar."
              />
            </div>
          </div>
        </section>

        {/* Student Dashboard Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12 border-b border-border pb-6">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
                <p className="text-muted-foreground">A focused, distraction-free environment for learning.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={LayoutDashboard}
                title="Personalized Learning Hub"
                description="A clean interface highlighting enrolled courses, upcoming deadlines, and recent grades."
              />
              <FeatureCard
                icon={Video}
                title="Interactive Lesson Viewer"
                description="Responsive video playback, downloadable resources, and progress tracking per module."
              />
              <FeatureCard
                icon={Award}
                title="Gamification & Certificates"
                description="Earn badges for achievements and download verified certificates upon course completion."
              />
              <FeatureCard
                icon={MessageSquare}
                title="Collaborative Forums"
                description="Engage with peers and instructors through course-specific discussion boards."
              />
              <FeatureCard
                icon={FileText}
                title="Seamless Submissions"
                description="Upload assignments directly, take timed quizzes, and view detailed feedback rubrics."
              />
              <FeatureCard
                icon={Calendar}
                title="Unified Calendar"
                description="A consolidated view of all live classes, assignment due dates, and institutional events."
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted/10 transition-colors">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
