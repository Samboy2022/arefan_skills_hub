import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ArrowRight } from 'lucide-react'

export default function CareersPage() {
  const jobs = [
    { title: "Senior Full Stack Engineer (Next.js)", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
    { title: "Customer Success Manager", department: "Support", location: "Remote (EMEA)", type: "Full-time" },
    { title: "Enterprise Sales Executive", department: "Sales", location: "Remote (US/Canada)", type: "Full-time" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Build the future of <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Education</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Join a fully distributed team passionate about empowering educators and learners worldwide.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Open Positions</h2>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={index} className="bg-card border border-border p-6 rounded-xl hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-full flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-muted/50 rounded-2xl p-8 text-center border border-border">
              <h3 className="text-xl font-bold mb-3">Don't see a fit?</h3>
              <p className="text-muted-foreground mb-6">
                We're always looking for talented individuals. Send your resume and a cover letter to <a href="mailto:careers@fnskills.com" className="text-primary hover:underline">careers@fnskills.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
