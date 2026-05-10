import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Careers at <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">FnSkills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Help us build the infrastructure that powers global education.
            </p>
          </div>
        </section>

        {/* Call to Action Banner (Professional, Long width, Short height ~15vh) */}
        <section className="py-8 bg-muted/10 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-full h-[15vh] min-h-[120px] max-h-[200px] relative overflow-hidden flex items-center justify-between px-8 md:px-16 border-dashed border-2 border-border/50">
               <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-background to-primary/10" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full">
                 <div className="text-left mb-4 md:mb-0">
                   <h2 className="text-2xl font-bold mb-1">Open Positions</h2>
                   <p className="text-muted-foreground">We are hiring across engineering, design, and customer success.</p>
                 </div>
                 <Button size="lg">View All Roles</Button>
               </div>
            </Card>
          </div>
        </section>

        {/* Careers Info Sections */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
               <div className="prose prose-slate dark:prose-invert max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Remote-First Culture</h2>
                 <p className="text-lg text-muted-foreground">
                   We believe talent is global. Our team operates asynchronously and distributed across multiple time zones. We provide stipends for home office setups and co-working spaces to ensure you have what you need to do your best work.
                 </p>
               </div>
               <Card className="h-[300px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Remote Team Working</span>
               </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
               <Card className="h-[300px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl order-2 md:order-1">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Growth & Benefits</span>
               </Card>
               <div className="prose prose-slate dark:prose-invert max-w-none order-1 md:order-2">
                 <h2 className="text-3xl font-bold mb-6">Benefits & Growth</h2>
                 <p className="text-lg text-muted-foreground">
                   We invest in our people. From comprehensive health coverage to continuous learning budgets and regular team retreats, we ensure that as the company grows, you grow alongside it.
                 </p>
               </div>
            </div>

          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
