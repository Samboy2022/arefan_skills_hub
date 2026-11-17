import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Cloud,
  LayoutDashboard,
  ShieldCheck,
  Building,
  GraduationCap,
  Globe,
  BarChart3,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { HeroTextRotator } from '@/components/hero-text-rotator'
import {
  CtaBanner,
  InfoCard,
  SectionHeader,
  containerClasses,
  mutedSectionClasses,
  sectionClasses,
} from '@/components/marketing'

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
const audiences = [
  {
    icon: Building,
    title: 'Universities & Colleges',
    description:
      'Manage multiple faculties, departments, and thousands of students efficiently.',
  },
  {
    icon: GraduationCap,
    title: 'K-12 Schools',
    description:
      'Streamline communication between teachers, students, and parents.',
  },
  {
    icon: Globe,
    title: 'Corporate Training',
    description:
      'Onboard employees and track compliance training with robust reporting.',
  },
  {
    icon: Users,
    title: 'Private Tutors',
    description:
      'Professionalize your offering with a branded portal for your students.',
  },
]

const steps = [
  {
    title: 'Choose a Plan',
    description:
      "Select the subscription tier that fits your institution's size and needs.",
  },
  {
    title: 'Claim Sub-domain',
    description:
      'Get a dedicated URL (e.g., yourschool.arefanskillshub.com) for your branded portal.',
  },
  {
    title: 'Start Teaching',
    description:
      'Upload courses, invite instructors, and enroll students immediately.',
  },
]

const features = [
  {
    icon: Cloud,
    title: 'Multi-Tenant Architecture',
    description:
      'Secure, isolated environments for every institution. Your data is kept strictly separate while benefiting from shared cloud infrastructure.',
  },
  {
    icon: LayoutDashboard,
    title: 'White-Labeled Dashboards',
    description:
      'Customize the look and feel. Use your own logos, brand colors, and dedicated sub-domain to maintain institutional identity.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    description:
      'Granular permissions with dedicated portals for Super Admins, School Admins, Instructors, and Students.',
  },
  {
    icon: BookOpen,
    title: 'Robust Curriculum Builder',
    description:
      'Create complex course structures, modules, and lessons. Support for multimedia content, assignments, and live classes.',
  },
  {
    icon: CheckCircle2,
    title: 'Advanced Assessments',
    description:
      'Comprehensive quizzing engine, assignment submissions, automated grading, and detailed performance analytics.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Track attendance, engagement metrics, financial data, and overall institutional health through intuitive visual dashboards.',
  },
]

// Add real partner names/logos here — the section stays hidden while empty.
const partners: string[] = []

const integrationRows = [
  [
    'https://cdn-icons-png.flaticon.com/512/5968/5968854.png',
    'https://cdn-icons-png.flaticon.com/512/732/732221.png',
    'https://cdn-icons-png.flaticon.com/512/733/733609.png',
    'https://cdn-icons-png.flaticon.com/512/732/732084.png',
    'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    'https://cdn-icons-png.flaticon.com/512/281/281763.png',
    'https://cdn-icons-png.flaticon.com/512/888/888879.png',
  ],
  [
    'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    'https://cdn-icons-png.flaticon.com/512/906/906324.png',
    'https://cdn-icons-png.flaticon.com/512/888/888841.png',
    'https://cdn-icons-png.flaticon.com/512/5968/5968875.png',
    'https://cdn-icons-png.flaticon.com/512/906/906361.png',
    'https://cdn-icons-png.flaticon.com/512/732/732190.png',
    'https://cdn-icons-png.flaticon.com/512/888/888847.png',
  ],
]

/* ------------------------------------------------------------------ */
/*  Page-specific building blocks                                       */
/* ------------------------------------------------------------------ */
function StepItem({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <li className="relative z-10 flex flex-col items-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-card shadow-sm">
        <span className="text-2xl font-bold text-primary">
          {String(step).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </li>
  )
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
          />

          <div className={cn(containerClasses, 'text-center')}>
            <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" aria-hidden />
              Enterprise-Grade Multi-Tenant Infrastructure
            </div>

            <h1 className="mx-auto mb-6 flex max-w-5xl flex-col items-center gap-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:gap-3 md:text-6xl lg:text-7xl">
              <span>Your Institution&apos;s</span>
              <HeroTextRotator />
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
              Instantly deploy a secure, branded learning environment. Arefan Skills Hub
              provides the cloud infrastructure so you can focus on delivering
              exceptional educational experiences.
            </p>

            <div className="mx-auto mb-4 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Button asChild size="xl" className="group shadow-lg shadow-primary/25">
                <Link href="/login">
                  Start Your Free Trial
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="bg-card">
                <Link href="/library">Browse the library</Link>
              </Button>
            </div>
            <p className="mb-16 text-sm text-muted-foreground">
              <Link href="#how-it-works" className="underline-offset-4 hover:underline">See how it works</Link>
            </p>

            {/* Dashboard preview */}
            <div className="relative mx-auto max-w-5xl">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-[3rem] bg-primary/15 blur-3xl"
              />
              <div className="rounded-2xl border border-border/60 bg-card/70 p-2 shadow-2xl backdrop-blur-sm">
                <div className="overflow-hidden rounded-xl border border-border bg-background">
                  <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/50 px-4">
                    <div className="flex gap-1.5" aria-hidden>
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex flex-1 justify-center">
                      <div className="flex h-5 w-48 items-center justify-center rounded-md bg-background/80 text-[10px] text-muted-foreground">
                        dashboard.arefanskillshub.com
                      </div>
                    </div>
                    <div className="w-[42px]" aria-hidden />
                  </div>
                  <Image
                    src="/dashboard-preview.png"
                    alt="Arefan Skills Hub dashboard preview"
                    width={1920}
                    height={1080}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Audience ───────────────────────────────────────────────── */}
        <section id="audience" className={sectionClasses}>
          <div className={containerClasses}>
            <SectionHeader
              eyebrow="Who it's for"
              title="Empowering Every Learning Environment"
              description="Our multi-tenant architecture scales and adapts to the unique needs of every educational organization."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((a) => (
                <InfoCard key={a.title} {...a} centered />
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className={cn(sectionClasses, 'scroll-mt-16', mutedSectionClasses)}
        >
          <div className={containerClasses}>
            <SectionHeader
              eyebrow="How it works"
              title="Launch Your Academy in Minutes"
              description="No complex technical setup required. We handle the infrastructure so you can focus on education."
            />
            <div className="relative">
              <div
                aria-hidden
                className="absolute top-10 left-[16.67%] right-[16.67%] hidden h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 md:block"
              />
              <ol className="grid gap-12 md:grid-cols-3">
                {steps.map((s, i) => (
                  <StepItem key={s.title} step={i + 1} {...s} />
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────────── */}
        <section id="features" className={cn(sectionClasses, 'scroll-mt-16')}>
          <div className={containerClasses}>
            <SectionHeader
              eyebrow="Features"
              title="Everything Your Institution Needs"
              description="Manage every part of a modern educational institution under one roof."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <InfoCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust (renders once real partners are added) ───────────── */}
        {partners.length > 0 && (
          <section className="border-t border-border/60 bg-muted/40 py-16">
            <div className={cn(containerClasses, 'text-center')}>
              <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Trusted by forward-thinking institutions
              </p>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
                {partners.map((name) => (
                  <span
                    key={name}
                    className="text-lg font-bold tracking-tight text-muted-foreground"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Integrations ───────────────────────────────────────────── */}
        <section className={cn(sectionClasses, 'overflow-hidden', mutedSectionClasses)}>
          <div className={containerClasses}>
            <SectionHeader
              eyebrow="Integrations"
              title="Seamlessly Integrated. Infinitely Scalable."
              description="Arefan Skills Hub connects with the tools your institution already uses, creating a unified educational ecosystem."
            />

            <div className="mx-auto mb-12 max-w-5xl space-y-6 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              {integrationRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  aria-hidden
                  className={cn(
                    'flex w-max gap-8 motion-reduce:animate-none',
                    rowIndex % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'
                  )}
                >
                  {Array.from({ length: 4 })
                    .flatMap(() => row)
                    .map((src, i) => (
                      <div
                        key={i}
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-8 w-8 object-contain" loading="lazy" />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button asChild size="xl" variant="outline" className="group bg-card">
                <Link href="/integrations">
                  View All Integrations
                  <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────────── */}
        <CtaBanner
          title="Ready to launch your institution's portal?"
          description="Join the growing network of educational organizations leveraging Arefan Skills Hub's cloud infrastructure."
          secondary={{ label: 'View Pricing', href: '/pricing' }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
