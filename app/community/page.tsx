import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Join the <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">FnSkills</span> Community
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Connect with educators, administrators, and students shaping the future of learning.
            </p>
          </div>
        </section>

        {/* Call to Action Banner (Professional, Long width, Short height ~15vh) */}
        <section className="py-8 bg-muted/10 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-full h-[15vh] min-h-[120px] max-h-[200px] relative overflow-hidden flex items-center justify-center border-dashed border-2 border-border/50">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-green-400/20" />
               <div className="relative z-10 text-center px-4">
                 <h2 className="text-2xl font-bold mb-2">Ready to contribute?</h2>
                 <p className="text-muted-foreground">Join our public forums to share your ideas and get help from the community.</p>
               </div>
            </Card>
          </div>
        </section>

        {/* Community Sections */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
               <div className="prose prose-slate dark:prose-invert max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Educator Forums</h2>
                 <p className="text-lg text-muted-foreground">
                   Share best practices, course templates, and pedagogical strategies with other instructors using the FnSkills platform. Discuss how to best engage students using our built-in tools.
                 </p>
               </div>
               <Card className="h-[300px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Forums Interface</span>
               </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
               <Card className="h-[300px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl order-2 md:order-1">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Open Source/Developer Tools</span>
               </Card>
               <div className="prose prose-slate dark:prose-invert max-w-none order-1 md:order-2">
                 <h2 className="text-3xl font-bold mb-6">Developer Network</h2>
                 <p className="text-lg text-muted-foreground">
                   Are you building custom integrations or themes? Connect with our engineering team and other developers in our developer network. Get early access to API updates and technical support.
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
