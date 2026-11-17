import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import {
  CategoryHeader,
  CtaBanner,
  IconBox,
  InfoCard,
  PageHero,
  containerClasses,
  sectionClasses,
} from '@/components/marketing'
import { Video, Mail, CreditCard, Plug, Code, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Integrations — Fnskills LMS',
  description: 'Connect Fnskills with Zoom, Google Meet, Stripe, PayPal, Mailchimp, and more. Extend your LMS with powerful third-party integrations.',
  openGraph: {
    title: 'Fnskills Integrations — Connect Your Favorite Tools',
    description: 'Powerful integrations for live classes, payments, email marketing, SMS notifications, and custom API development.',
  },
}

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          badge="Works with the tools you already use"
          badgeIcon={Plug}
          title="Connect with your"
          highlight="Favorite Tools"
          description="Extend Fnskills with powerful third-party integrations to automate your workflow and enhance the learning experience."
        />

        {/* Integration Categories */}
        <section className={sectionClasses}>
          <div className={containerClasses}>

            {/* Live Class & Video */}
            <div className="mb-16 md:mb-20">
              <CategoryHeader icon={Video} title="Live Classes & Video" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard
                  title="Zoom Integration"
                  description="Automatically generate and embed Zoom meeting links directly into course schedules. Sync attendance automatically."
                  tags={['Live Streaming', 'Webinar']}
                />
                <IntegrationCard
                  title="Google Meet"
                  description="Seamlessly schedule and launch Google Meet sessions from the Instructor Dashboard."
                  tags={['Live Classes']}
                />
                <IntegrationCard
                  title="Vimeo / YouTube"
                  description="Securely embed external video content into modules without leaving the LMS environment."
                  tags={['VOD', 'Hosting']}
                />
              </div>
            </div>

            {/* Communication & Marketing */}
            <div className="mb-16 md:mb-20">
              <CategoryHeader icon={Mail} title="Communication & Marketing" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard
                  title="Mailchimp"
                  description="Sync your student lists with Mailchimp to send targeted newsletters and promotional campaigns."
                  tags={['Email Marketing']}
                />
                <IntegrationCard
                  title="Twilio SMS API"
                  description="Trigger automated SMS alerts for upcoming class reminders, assignment deadlines, and emergency broadcasts."
                  tags={['SMS', 'Notifications']}
                />
                <IntegrationCard
                  title="SendGrid"
                  description="Ensure high deliverability for all transactional emails, password resets, and enrollment confirmations."
                  tags={['Transactional Email']}
                />
              </div>
            </div>

            {/* Payments & Finance */}
            <div className="mb-16 md:mb-20">
              <CategoryHeader icon={CreditCard} title="Payments & Finance" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard
                  title="Stripe"
                  description="Accept global payments, manage subscriptions, and handle automated payouts."
                  tags={['Payment Gateway']}
                />
                <IntegrationCard
                  title="PayPal"
                  description="Offer a widely recognized payment option for student enrollments and course purchases."
                  tags={['Payment Gateway']}
                />
                <IntegrationCard
                  title="Paystack / Flutterwave"
                  description="Robust local payment integration designed specifically for African markets."
                  tags={['Regional Payments']}
                />
              </div>
            </div>

            {/* Developer API */}
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-border/60 bg-muted/40 p-8 md:flex-row md:items-center md:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <IconBox icon={Code} className="shrink-0" />
                  <h3 className="text-2xl font-bold tracking-tight">Custom Webhooks & API</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Don't see the integration you need? Enterprise customers can utilize our comprehensive REST API and webhooks to build custom connections with legacy HR systems, ERPs, and custom CRMs.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button asChild size="xl" variant="outline" className="group bg-card">
                  <Link href="/documentation">
                    View Documentation
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        <CtaBanner
          title="Bring your whole toolkit with you"
          description="Start your free trial and connect the services your institution already relies on in minutes."
          secondary={{ label: 'Explore Features', href: '/features' }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

function IntegrationCard({ title, description, tags }: { title: string, description: string, tags: string[] }) {
  return (
    <InfoCard title={title} description={description}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {tag}
          </span>
        ))}
      </div>
    </InfoCard>
  )
}
