import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import {
  CtaBanner,
  InfoCard,
  PageHero,
  SectionHeader,
  containerClasses,
  mutedSectionClasses,
  sectionClasses,
} from '@/components/marketing'
import { cn } from '@/lib/utils'
import { HeartHandshake, Shield, Lightbulb, ShieldCheck, Users, Globe2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Arefan Skills Hub — Our Story & Mission',
  description: 'Arefan Skills Hub is on a mission to democratize access to enterprise-grade educational technology. Learn about our story, mission, and core values.',
  openGraph: {
    title: 'About Arefan Skills Hub — Democratizing Education Technology',
    description: 'We believe technology should be an enabler, not a barrier. Discover the Arefan Skills Hub story.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          title="About"
          highlight="Arefan Skills Hub"
          description="We are on a mission to democratize access to enterprise-grade educational technology for institutions of all sizes."
        />

        {/* Section 1: Our Story */}
        <section className={sectionClasses}>
          <div className={cn(containerClasses, 'max-w-7xl')}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-4 text-lg animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                  <Users className="mr-2 h-3.5 w-3.5" />
                  Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-foreground">Where it all began</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Arefan Skills Hub was founded with a simple observation: while large universities had access to incredibly powerful learning management systems, smaller institutions, private tutors, and corporate training teams were left stitching together fragmented tools.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We built Arefan Skills Hub to bridge this gap. By utilizing a secure, multi-tenant cloud infrastructure, we are able to provide organizations of all sizes with a dedicated, white-labeled platform that scales effortlessly as they grow.
                </p>
              </div>
              <div className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 animate-in fade-in slide-in-from-right-8 duration-700">
                 <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1470"
                    alt="Team collaborating on educational technology"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className={cn(sectionClasses, mutedSectionClasses)}>
          <div className={cn(containerClasses, 'max-w-7xl')}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                 <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1470"
                    alt="Global education and learning technology"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
              </div>
              <div className="space-y-4 text-lg order-1 lg:order-2 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                  <Globe2 className="mr-2 h-3.5 w-3.5" />
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-foreground">Empowering educators globally</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower educators globally by providing them with the technological infrastructure needed to deliver exceptional learning experiences, without the overhead of IT management.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that technology should be an enabler, not a barrier. By removing technical friction, we allow educators to focus on what they do best: teaching and inspiring the next generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Core Values */}
        <section className={sectionClasses}>
          <div className={cn(containerClasses, 'max-w-7xl')}>
            <SectionHeader
              eyebrow="Our values"
              title="Our Core Values"
              description="The principles that guide every feature we build and every decision we make."
            />
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon={HeartHandshake}
                title="Accessibility"
                description="High-quality educational tools should be available to all institutions, regardless of size or budget."
              />
              
              <InfoCard
                icon={Shield}
                title="Reliability"
                description="We understand that education cannot pause for server downtime. We build for absolute resilience."
              />
              
              <InfoCard
                icon={Lightbulb}
                title="Innovation"
                description="We continuously integrate the latest advancements in web technology and pedagogy into our platform."
              />
              
              <InfoCard
                icon={ShieldCheck}
                title="Privacy"
                description="Data isolation and security are foundational to our multi-tenant architecture, not afterthoughts."
              />
            </div>
          </div>
        </section>
        <CtaBanner
          title="Join us in shaping the future of learning"
          description="Launch your institution's portal today, or come build it with us."
          secondary={{ label: 'View Careers', href: '/careers' }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
