import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import { HeartHandshake, Shield, Lightbulb, ShieldCheck, Users, Globe2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About FnSkills — Our Story & Mission',
  description: 'FnSkills is on a mission to democratize access to enterprise-grade educational technology. Learn about our story, mission, and core values.',
  openGraph: {
    title: 'About FnSkills — Democratizing Education Technology',
    description: 'We believe technology should be an enabler, not a barrier. Discover the FnSkills story.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.08] bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-green-400">FnSkills</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 max-w-3xl mx-auto leading-relaxed">
              We are on a mission to democratize access to enterprise-grade educational technology for institutions of all sizes.
            </p>
          </div>
        </section>

        {/* Section 1: Our Story */}
        <section className="py-24 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="prose prose-lg dark:prose-invert max-w-none animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
                  <Users className="mr-2 h-4 w-4" />
                  Our Story
                </div>
                <h2 className="text-4xl font-bold mb-6 text-foreground">Where it all began</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FnSkills was founded with a simple observation: while large universities had access to incredibly powerful learning management systems, smaller institutions, private tutors, and corporate training teams were left stitching together fragmented tools.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We built FnSkills to bridge this gap. By utilizing a secure, multi-tenant cloud infrastructure, we are able to provide organizations of all sizes with a dedicated, white-labeled platform that scales effortlessly as they grow.
                </p>
              </div>
              <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 animate-in fade-in slide-in-from-right-8 duration-700">
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
        <section className="py-24 border-b border-border/50 bg-muted/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                 <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1470"
                    alt="Global education and learning technology"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent pointer-events-none" />
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none order-1 lg:order-2 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
                  <Globe2 className="mr-2 h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-4xl font-bold mb-6 text-foreground">Empowering educators globally</h2>
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
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16 animate-in fade-in zoom-in-95 duration-700">
              <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every feature we build and every decision we make.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-muted/50 group">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Accessibility</h3>
                <p className="text-muted-foreground">High-quality educational tools should be available to all institutions, regardless of size or budget.</p>
              </Card>
              
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-muted/50 group">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Reliability</h3>
                <p className="text-muted-foreground">We understand that education cannot pause for server downtime. We build for absolute resilience.</p>
              </Card>
              
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-muted/50 group">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Innovation</h3>
                <p className="text-muted-foreground">We continuously integrate the latest advancements in web technology and pedagogy into our platform.</p>
              </Card>
              
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-muted/50 group">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Privacy</h3>
                <p className="text-muted-foreground">Data isolation and security are foundational to our multi-tenant architecture, not afterthoughts.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
