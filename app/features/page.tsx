import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import {
  CategoryHeader,
  CtaBanner,
  InfoCard,
  PageHero,
  containerClasses,
  mutedSectionClasses,
  sectionClasses,
} from '@/components/marketing'
import { cn } from '@/lib/utils'
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
  Video,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features — Arefan Skills Hub LMS',
  description: 'Explore Arefan Skills Hub features built for school administrators, instructors, and students. White-label subdomains, drag-and-drop course builder, gamified learning, and more.',
  openGraph: {
    title: 'Arefan Skills Hub Features — Built for Scale',
    description: 'Comprehensive LMS tools for administrators, instructors, and students.',
  },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          badge="One platform, three dashboards"
          badgeIcon={Sparkles}
          title="Features Built for"
          highlight="Scale"
          description="Discover the comprehensive suite of tools designed specifically for Administrators, Instructors, and Students."
        />

        {/* School Admin Dashboard Features */}
        <section className={sectionClasses}>
          <div className={containerClasses}>
            <CategoryHeader
              icon={Building}
              title="School Admin Dashboard"
              description="Command center for institutional oversight and management."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={LayoutDashboard}
                title="White-label Subdomain"
                description="Custom domain mapping (e.g., academy.yourschool.com) with full branding control, including logos and color schemes."
              />
              <InfoCard
                icon={Users}
                title="User & Role Management"
                description="Easily onboard thousands of students and faculty. Assign granular roles and permissions across departments."
              />
              <InfoCard
                icon={ShieldCheck}
                title="Curriculum Oversight"
                description="Review, approve, and manage course structures across all departments and faculty members."
              />
              <InfoCard
                icon={Zap}
                title="Advanced Analytics"
                description="Real-time reporting on student performance, engagement metrics, revenue, and institutional health."
              />
              <InfoCard
                icon={Settings}
                title="Global Settings"
                description="Configure academic calendars, grading scales, notification templates, and integration APIs."
              />
              <InfoCard
                icon={FileText}
                title="Compliance & Auditing"
                description="Track administrative actions, generate compliance reports, and manage data retention policies."
              />
            </div>
          </div>
        </section>

        {/* Instructor Dashboard Features */}
        <section className={cn(sectionClasses, mutedSectionClasses)}>
          <div className={containerClasses}>
            <CategoryHeader
              icon={Users}
              title="Instructor Dashboard"
              description="Powerful tools to create, engage, and evaluate."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={BookOpen}
                title="Drag-and-Drop Course Builder"
                description="Intuitive interface to create modules, upload multimedia lessons, and structure curriculum without coding."
              />
              <InfoCard
                icon={Video}
                title="Live Classes & Webinars"
                description="Built-in integration for Zoom and other video conferencing tools for seamless live sessions."
              />
              <InfoCard
                icon={FileText}
                title="Advanced Assessments"
                description="Create timed quizzes, varied question types, and comprehensive assignment rubrics."
              />
              <InfoCard
                icon={Award}
                title="Automated Gradebook"
                description="Automatically sync quiz scores and manage manual assignment grading in a centralized gradebook."
              />
              <InfoCard
                icon={MessageSquare}
                title="Student Engagement Tools"
                description="Direct messaging, course announcements, and moderated discussion forums."
              />
              <InfoCard
                icon={Calendar}
                title="Schedule Management"
                description="Manage office hours, assignment deadlines, and live class schedules mapped to the academic calendar."
              />
            </div>
          </div>
        </section>

        {/* Student Dashboard Features */}
        <section className={sectionClasses}>
          <div className={containerClasses}>
            <CategoryHeader
              icon={GraduationCap}
              title="Student Dashboard"
              description="A focused, distraction-free environment for learning."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={LayoutDashboard}
                title="Personalized Learning Hub"
                description="A clean interface highlighting enrolled courses, upcoming deadlines, and recent grades."
              />
              <InfoCard
                icon={Video}
                title="Interactive Lesson Viewer"
                description="Responsive video playback, downloadable resources, and progress tracking per module."
              />
              <InfoCard
                icon={Award}
                title="Gamification & Certificates"
                description="Earn badges for achievements and download verified certificates upon course completion."
              />
              <InfoCard
                icon={MessageSquare}
                title="Collaborative Forums"
                description="Engage with peers and instructors through course-specific discussion boards."
              />
              <InfoCard
                icon={FileText}
                title="Seamless Submissions"
                description="Upload assignments directly, take timed quizzes, and view detailed feedback rubrics."
              />
              <InfoCard
                icon={Calendar}
                title="Unified Calendar"
                description="A consolidated view of all live classes, assignment due dates, and institutional events."
              />
            </div>
          </div>
        </section>
        <CtaBanner
          title="See every feature in action"
          description="Launch your institution's portal and give admins, instructors, and students the tools they need from day one."
          secondary={{ label: 'View Pricing', href: '/pricing' }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
