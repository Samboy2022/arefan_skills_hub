import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BookOpen,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cloud,
  LayoutDashboard,
  ShieldCheck,
  Building,
  GraduationCap,
  Globe,
  BarChart3,
  Video,
  Lock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { HeroTextRotator } from '@/components/hero-text-rotator'

/* ------------------------------------------------------------------ */
/*  Reusable icon wrapper — consistent across every section            */
/* ------------------------------------------------------------------ */
function IconBox({
  icon: Icon,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div
      className={cn(
        'h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 shadow-sm',
        className
      )}
    >
      <Icon className="h-6 w-6 text-primary" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Audience card                                                       */
/* ------------------------------------------------------------------ */
function AudienceCard({
  icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <IconBox icon={icon} className="mb-5 mx-auto" />
        <h3 className="text-lg font-semibold mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
          {description}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                        */
/* ------------------------------------------------------------------ */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card className="group h-full border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <CardHeader className="relative pb-2">
        <IconBox icon={icon} className="mb-4" />
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Integration card                                                    */
/* ------------------------------------------------------------------ */
function IntegrationCard({
  icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card className="group h-full border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <CardHeader className="relative pb-2">
        <IconBox icon={icon} className="mb-4" />
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Step item                                                           */
/* ------------------------------------------------------------------ */
function StepItem({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 shadow-lg flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-primary">{step}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  cn helper (inline to avoid extra import)                            */
/* ------------------------------------------------------------------ */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero Section ───────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden">
          {/* subtle grid background */}
          <div
            className="absolute inset-0 -z-20 opacity-40 dark:opacity-20"
            style={{
              background:
                'radial-gradient(125% 125% at 50% 10%, transparent 40%, oklch(0.61 0.19 149.213) 100%)',
            }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Enterprise-Grade Multi-Tenant Infrastructure</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl mx-auto flex flex-col items-center justify-center gap-3">
              <span>Your Institution&apos;s</span>
              <HeroTextRotator />
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Instantly deploy a secure, branded learning environment. FnSkills
              provides the cloud infrastructure so you can focus on delivering
              exceptional educational experiences.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/login">
                <button
                  className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-lg group text-white bg-gradient-to-tr from-primary/80 via-primary to-primary/80 ring-4 ring-primary/30 dark:text-white dark:from-primary/80 dark:via-primary dark:to-primary/80 dark:ring-primary/30 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-white/20 dark:before:from-white/10 before:blur-xl"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button
                  className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-lg border group text-emerald-950 bg-gradient-to-tr from-white/90 via-white to-white/90 ring-4 ring-emerald-100/50 border-white dark:text-emerald-50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/20 dark:ring-primary/50 dark:border-primary/50 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-primary/10 dark:before:from-primary/40 before:blur-xl"
                >
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-3xl rounded-[3rem]" />
              <div className="rounded-2xl border border-border/60 bg-card/60 p-2 shadow-2xl backdrop-blur-sm">
                <div className="rounded-xl overflow-hidden border border-border bg-background shadow-inner">
                  {/* Browser Chrome */}
                  <div className="h-9 border-b border-border bg-muted/40 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="h-5 w-48 rounded-md bg-muted/60 text-[10px] flex items-center justify-center text-muted-foreground">
                        dashboard.fnskills.app
                      </div>
                    </div>
                  </div>
                  <Image
                    src="/dashboard-preview.png"
                    alt="FnSkills Dashboard Preview"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Audience Section ───────────────────────────────────────── */}
        <section id="audience" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Empowering Every Learning Environment
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Our multi-tenant architecture scales and adapts to the unique
                needs of every educational organization.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AudienceCard
                icon={Building}
                title="Universities & Colleges"
                description="Manage multiple faculties, departments, and thousands of students efficiently."
              />
              <AudienceCard
                icon={GraduationCap}
                title="K-12 Schools"
                description="Streamline communication between teachers, students, and parents."
              />
              <AudienceCard
                icon={Globe}
                title="Corporate Training"
                description="Onboard employees and track compliance training with robust reporting."
              />
              <AudienceCard
                icon={Users}
                title="Private Tutors"
                description="Professionalize your offering with a branded portal for your students."
              />
            </div>
          </div>
        </section>

        {/* ── How It Works Section ───────────────────────────────────── */}
        <section
          id="how-it-works"
          className="py-20 md:py-28 bg-muted/30 border-y border-border/50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Launch Your Academy in Minutes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                No complex technical setup required. We handle the infrastructure
                so you can focus on education.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <StepItem
                step="01"
                title="Choose a Plan"
                description="Select the subscription tier that fits your institution's size and needs."
              />
              <StepItem
                step="02"
                title="Claim Sub-domain"
                description="Get a dedicated URL (e.g., yourschool.fnskills.com) for your branded portal."
              />
              <StepItem
                step="03"
                title="Start Teaching"
                description="Upload courses, invite instructors, and enroll students immediately."
              />
            </div>
          </div>
        </section>

        {/* ── Features Section ───────────────────────────────────────── */}
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Enterprise-Grade Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Everything you need to manage a modern educational institution
                under one roof.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Cloud}
                title="Multi-Tenant Architecture"
                description="Secure, isolated environments for every institution. Your data is kept strictly separate while benefiting from shared cloud infrastructure."
              />
              <FeatureCard
                icon={LayoutDashboard}
                title="White-Labeled Dashboards"
                description="Customize the look and feel. Use your own logos, brand colors, and dedicated sub-domain to maintain institutional identity."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Role-Based Access Control"
                description="Granular permissions with dedicated portals for Super Admins, School Admins, Instructors, and Students."
              />
              <FeatureCard
                icon={BookOpen}
                title="Robust Curriculum Builder"
                description="Create complex course structures, modules, and lessons. Support for multimedia content, assignments, and live classes."
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Advanced Assessments"
                description="Comprehensive quizzing engine, assignment submissions, automated grading, and detailed performance analytics."
              />
              <FeatureCard
                icon={BarChart3}
                title="Real-time Analytics"
                description="Track attendance, engagement metrics, financial data, and overall institutional health through intuitive visual dashboards."
              />
            </div>
          </div>
        </section>

        {/* ── Trust Section ──────────────────────────────────────────── */}
        <section className="py-16 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
              Trusted by forward-thinking institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 opacity-50">
              {/* Abstract logo placeholders — geometric, professional */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <div className="h-8 w-8 rounded-lg bg-current opacity-20" />
                  <span className="text-lg font-bold tracking-tight">
                    Partner {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Integrations Section ───────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-background border-y border-border/40 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Seamlessly Integrated. Infinitely Scalable.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                FnSkills connects with the tools your institution already uses,
                creating a unified educational ecosystem.
              </p>
            </div>

            {/* Carousel */}
            <div className="mt-12 overflow-hidden relative pb-2 max-w-5xl mx-auto mb-16">
              {/* Row 1 */}
              <div className="flex w-max gap-10 whitespace-nowrap animate-scroll-left">
                {Array.from({ length: 4 }).flatMap(() => [
                  "https://cdn-icons-png.flaticon.com/512/5968/5968854.png",
                  "https://cdn-icons-png.flaticon.com/512/732/732221.png",
                  "https://cdn-icons-png.flaticon.com/512/733/733609.png",
                  "https://cdn-icons-png.flaticon.com/512/732/732084.png",
                  "https://cdn-icons-png.flaticon.com/512/733/733585.png",
                  "https://cdn-icons-png.flaticon.com/512/281/281763.png",
                  "https://cdn-icons-png.flaticon.com/512/888/888879.png",
                ]).map((src, i) => (
                  <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-card shadow-sm flex items-center justify-center border border-border/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Integration icon" className="h-8 w-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex w-max gap-10 whitespace-nowrap mt-8 animate-scroll-right">
                {Array.from({ length: 4 }).flatMap(() => [
                  "https://cdn-icons-png.flaticon.com/512/174/174857.png",
                  "https://cdn-icons-png.flaticon.com/512/906/906324.png",
                  "https://cdn-icons-png.flaticon.com/512/888/888841.png",
                  "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",
                  "https://cdn-icons-png.flaticon.com/512/906/906361.png",
                  "https://cdn-icons-png.flaticon.com/512/732/732190.png",
                  "https://cdn-icons-png.flaticon.com/512/888/888847.png",
                ]).map((src, i) => (
                  <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-card shadow-sm flex items-center justify-center border border-border/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Integration icon" className="h-8 w-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Fade overlays */}
              <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/integrations">
                <button
                  className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-lg group text-white bg-gradient-to-tr from-primary/80 via-primary to-primary/80 ring-4 ring-primary/30 dark:text-white dark:from-primary/80 dark:via-primary dark:to-primary/80 dark:ring-primary/30 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-white/20 dark:before:from-white/10 before:blur-xl"
                >
                  View All Integrations
                  <ArrowUpRight className="ml-1.5 h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/features">
                <button
                  className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-lg border group text-emerald-950 bg-gradient-to-tr from-white/90 via-white to-white/90 ring-4 ring-emerald-100/50 border-white dark:text-emerald-50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/20 dark:ring-primary/50 dark:border-primary/50 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-primary/10 dark:before:from-primary/40 before:blur-xl"
                >
                  Explore Features
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
              {/* ambient orbs — theme-aware */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-20 blur-3xl pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-primary-foreground" />
              </div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 opacity-20 blur-3xl pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-primary-foreground" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
                  Ready to launch your institution&apos;s portal?
                </h2>
                <p className="text-primary-foreground/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join the growing network of educational organizations
                  leveraging FnSkills&apos; cloud infrastructure.
                </p>
                <Link href="/login">
                  <button
                    className="relative inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-lg border group text-emerald-950 bg-gradient-to-tr from-white/90 via-white to-white/90 ring-4 ring-emerald-100/50 border-white dark:text-emerald-50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/20 dark:ring-primary/50 dark:border-primary/50 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-primary/10 dark:before:from-primary/40 before:blur-xl mt-4"
                  >
                    Create Your Account Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
