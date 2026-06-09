import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Search, Book, User, Settings, CreditCard, ShieldAlert, MessageCircle, ArrowRight } from 'lucide-react'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Search Header Section */}
        <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>

            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search for articles, guides, or troubleshooting..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-background border-none focus:ring-2 focus:ring-white/50 shadow-lg text-lg"
              />
            </div>
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

        {/* Popular Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center">Popular Articles</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                <ArticleLink title="How to map your custom domain to Arefan Skills Hub" category="Platform Configuration" />
                <ArticleLink title="Bulk importing students via CSV" category="Getting Started" />
                <ArticleLink title="Setting up Zoom integration for live classes" category="Integrations & API" />
                <ArticleLink title="Why are my students not receiving email notifications?" category="Troubleshooting" />
                <ArticleLink title="Understanding the Role-Based Access Control (RBAC) permissions" category="Account & Profile" />
              </div>
            </div>
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
