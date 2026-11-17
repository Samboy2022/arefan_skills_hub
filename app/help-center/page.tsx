import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Book, User, Settings, CreditCard, ShieldAlert, MessageCircle, ArrowRight } from 'lucide-react'

const articles = [
  { title: 'How to map your custom domain to Arefan Skills Hub', category: 'Platform Configuration' },
  { title: 'Bulk importing students via CSV', category: 'Getting Started' },
  { title: 'Setting up Zoom integration for live classes', category: 'Integrations & API' },
  { title: 'Why are my students not receiving email notifications?', category: 'Troubleshooting' },
  { title: 'Understanding the Role-Based Access Control (RBAC) permissions', category: 'Account & Profile' },
]

export default async function HelpCenterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q ?? '').trim()
  const needle = query.toLowerCase()
  const results = needle
    ? articles.filter((a) => `${a.title} ${a.category}`.toLowerCase().includes(needle))
    : articles

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Search Header Section */}
        <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>

            <form role="search" action="/help-center#articles" method="get" className="relative max-w-2xl mx-auto">
              <label htmlFor="help-search" className="sr-only">
                Search help articles
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="help-search"
                name="q"
                type="search"
                defaultValue={query}
                autoComplete="off"
                placeholder="Search for articles, guides, or troubleshooting..."
                className="h-14 rounded-full border-transparent bg-background pl-12 pr-28 text-base text-foreground shadow-lg hover:border-transparent focus-visible:border-transparent focus-visible:ring-4 focus-visible:ring-white/60 md:text-lg dark:bg-background dark:hover:border-transparent [&::-webkit-search-cancel-button]:hidden"
              />
              <Button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full px-5">
                Search
              </Button>
            </form>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 -mt-10 relative z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard
                icon={Book}
                title="Getting Started"
                description="Basic setup guides for administrators, instructors, and students."
              />
              <CategoryCard
                icon={User}
                title="Account & Profile"
                description="Manage your personal information, roles, and preferences."
              />
              <CategoryCard
                icon={Settings}
                title="Platform Configuration"
                description="Customizing subdomains, themes, and global settings."
              />
              <CategoryCard
                icon={CreditCard}
                title="Billing & Subscriptions"
                description="Understanding plans, invoices, and payment methods."
              />
              <CategoryCard
                icon={ShieldAlert}
                title="Troubleshooting"
                description="Solutions for common login, playback, and upload issues."
              />
              <CategoryCard
                icon={MessageCircle}
                title="Integrations & API"
                description="Connecting third-party apps and utilizing webhooks."
              />
            </div>
          </div>
        </section>

        {/* Popular Articles / Search Results */}
        <section id="articles" className="py-16 bg-muted/30 scroll-mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center" aria-live="polite">
              {query ? `Results for “${query}”` : 'Popular Articles'}
            </h2>
            {results.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-border">
                  {results.map((a) => (
                    <ArticleLink key={a.title} title={a.title} category={a.category} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-muted-foreground">
                  No articles match your search. Try different keywords or{' '}
                  <Link href="/help-center#articles" className="font-medium text-primary hover:underline">
                    clear the search
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Our support team is available 24/7 to assist Enterprise and Professional plan customers.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              Contact Support <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function CategoryCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <a href="#" className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all group flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </a>
  )
}

function ArticleLink({ title, category }: { title: string, category: string }) {
  return (
    <a href="#" className="block p-6 hover:bg-muted/50 transition-colors group flex items-center justify-between">
      <div>
        <h4 className="text-lg font-medium group-hover:text-primary transition-colors mb-1">{title}</h4>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{category}</span>
      </div>
      <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
