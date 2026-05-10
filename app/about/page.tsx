import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              About <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">FnSkills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              We are on a mission to democratize access to enterprise-grade educational technology.
            </p>
          </div>
        </section>

        {/* Section 1: Our Story (Text Left, Image Right) */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground">
                  FnSkills was founded with a simple observation: while large universities had access to incredibly powerful learning management systems, smaller institutions, private tutors, and corporate training teams were left stitching together fragmented tools.
                </p>
                <p className="text-lg text-muted-foreground">
                  We built FnSkills to bridge this gap. By utilizing a secure, multi-tenant cloud infrastructure, we are able to provide organizations of all sizes with a dedicated, white-labeled platform that scales effortlessly as they grow.
                </p>
              </div>
              <Card className="h-[400px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-green-400/10" />
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Team Collaboration / Origin Story</span>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Our Mission (Image Left, Text Right) */}
        <section className="py-20 border-b border-border/50 bg-muted/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="h-[400px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl order-2 md:order-1">
                 <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-primary/10" />
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Global Education / Empowering Educators</span>
              </Card>
              <div className="prose prose-slate dark:prose-invert max-w-none order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To empower educators globally by providing them with the technological infrastructure needed to deliver exceptional learning experiences, without the overhead of IT management.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe that technology should be an enabler, not a barrier. By removing technical friction, we allow educators to focus on what they do best: teaching and inspiring the next generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Core Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              <Card className="p-6 border-border hover:border-primary/50 transition-colors bg-card">
                <h3 className="font-bold text-xl mb-3">Accessibility</h3>
                <p className="text-muted-foreground">High-quality educational tools should be available to all institutions, regardless of size or budget.</p>
              </Card>
              <Card className="p-6 border-border hover:border-primary/50 transition-colors bg-card">
                <h3 className="font-bold text-xl mb-3">Reliability</h3>
                <p className="text-muted-foreground">We understand that education cannot pause for server downtime. We build for absolute resilience.</p>
              </Card>
              <Card className="p-6 border-border hover:border-primary/50 transition-colors bg-card">
                <h3 className="font-bold text-xl mb-3">Innovation</h3>
                <p className="text-muted-foreground">We continuously integrate the latest advancements in web technology and pedagogy into our platform.</p>
              </Card>
              <Card className="p-6 border-border hover:border-primary/50 transition-colors bg-card">
                <h3 className="font-bold text-xl mb-3">Privacy</h3>
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
