import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Product <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Changelog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Stay up to date with the latest features, fixes, and improvements to Arefan Skills Hub.
            </p>
          </div>
        </section>

        {/* Changelog Sections (Alternating Layout) */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

            {/* Release 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-start mb-24 border-b border-border/50 pb-24">
               <div className="prose prose-slate dark:prose-invert max-w-none">
                 <div className="flex items-center gap-3 mb-6">
                   <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">May 2024</span>
                   <h2 className="text-3xl font-bold m-0">v2.1: Advanced Analytics Dashboard</h2>
                 </div>
                 <p className="text-lg text-muted-foreground">
                   We've completely overhauled the reporting infrastructure. Administrators can now generate custom reports on student engagement, financial metrics, and course completion rates with export options to CSV and PDF.
                 </p>
                 <ul>
                   <li>Added custom date range filtering for reports.</li>
                   <li>Introduced a new visual query builder for non-technical staff.</li>
                   <li>Fixed an issue with timezone synchronization in the gradebook.</li>
                 </ul>
               </div>
               <Card className="h-[350px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Analytics Dashboard UI</span>
               </Card>
            </div>

            {/* Release 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-start mb-24 border-b border-border/50 pb-24">
               <Card className="h-[350px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl order-2 md:order-1">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Mobile App Preview</span>
               </Card>
               <div className="prose prose-slate dark:prose-invert max-w-none order-1 md:order-2">
                 <div className="flex items-center gap-3 mb-6">
                   <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">April 2024</span>
                   <h2 className="text-3xl font-bold m-0">v2.0: Mobile Learning Experience</h2>
                 </div>
                 <p className="text-lg text-muted-foreground">
                   Learning doesn't stop at the desktop. We've released responsive design updates across all student dashboards and introduced a new Progressive Web App (PWA) installation flow for iOS and Android.
                 </p>
                 <ul>
                   <li>Offline caching for course reading materials.</li>
                   <li>Push notifications for upcoming assignment deadlines.</li>
                   <li>Optimized video playback for low-bandwidth environments.</li>
                 </ul>
               </div>
            </div>

            {/* Release 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
               <div className="prose prose-slate dark:prose-invert max-w-none">
                 <div className="flex items-center gap-3 mb-6">
                   <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">March 2024</span>
                   <h2 className="text-3xl font-bold m-0">v1.9: Interactive Quizzing Engine</h2>
                 </div>
                 <p className="text-lg text-muted-foreground">
                   Instructors requested more ways to test knowledge. We've expanded the quiz engine to support drag-and-drop categorization, audio responses, and advanced mathematical equation rendering via LaTeX.
                 </p>
               </div>
               <Card className="h-[300px] border-dashed border-2 border-border/50 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
                 <span className="z-10 bg-background/80 backdrop-blur px-4 py-2 rounded-md border border-border shadow-sm text-sm font-mono text-muted-foreground">Image: Advanced Quizzing Interface</span>
               </Card>
            </div>

          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
