import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DocSidebar } from '@/components/doc-sidebar'

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Arefan Skills Hub Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive guides to help you navigate and master the platform.
            </p>
          </div>
        </section>

        {/* Documentation Content Layout */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
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
