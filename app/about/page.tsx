import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">
              <h2>Our Story</h2>
              <p>
                FnSkills was founded with a simple observation: while large universities had access to incredibly powerful learning management systems, smaller institutions, private tutors, and corporate training teams were left stitching together fragmented tools.
              </p>
              <p>
                We built FnSkills to bridge this gap. By utilizing a secure, multi-tenant cloud infrastructure, we are able to provide organizations of all sizes with a dedicated, white-labeled platform that scales effortlessly as they grow.
              </p>

              <h2>Our Mission</h2>
              <p>
                To empower educators globally by providing them with the technological infrastructure needed to deliver exceptional learning experiences, without the overhead of IT management.
              </p>

              <h2>Our Core Values</h2>
              <ul>
                <li><strong>Accessibility:</strong> High-quality educational tools should be available to all institutions, regardless of size or budget.</li>
                <li><strong>Reliability:</strong> We understand that education cannot pause for server downtime. We build for resilience.</li>
                <li><strong>Innovation:</strong> We continuously integrate the latest advancements in web technology and pedagogy into our platform.</li>
                <li><strong>Privacy:</strong> Data isolation and security are foundational to our multi-tenant architecture, not afterthoughts.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
