import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DocSidebar } from '@/components/doc-sidebar'
import { PageHero, containerClasses } from '@/components/marketing'
import { cn } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        <PageHero
          badge="Guides for every role"
          badgeIcon={BookOpen}
          title="Arefan Skills Hub"
          highlight="Documentation"
          description="Comprehensive guides to help you navigate and master the platform."
        />

        {/* Documentation Content Layout */}
        <section className="py-12 md:py-16">
          <div className={cn(containerClasses, 'max-w-7xl flex flex-col md:flex-row gap-8 lg:gap-12')}>

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0 rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:self-start md:sticky md:top-24">
              <DocSidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
