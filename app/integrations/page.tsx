import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Mail, MessageSquare, CreditCard, Plug, Code } from 'lucide-react'

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Connect with your <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Favorite Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Extend FnSkills with powerful third-party integrations to automate your workflow and enhance the learning experience.
            </p>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Live Class & Video */}
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Live Classes & Video</h2>
              </div>
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
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Communication & Marketing</h2>
              </div>
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
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Payments & Finance</h2>
              </div>
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
            <div className="bg-muted/50 rounded-3xl p-8 md:p-12 border border-border flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">Custom Webhooks & API</h3>
                </div>
                <p className="text-muted-foreground text-lg mb-0">
                  Don't see the integration you need? Enterprise customers can utilize our comprehensive REST API and webhooks to build custom connections with legacy HR systems, ERPs, and custom CRMs.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  View API Documentation
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  )
}

function IntegrationCard({ title, description, tags }: { title: string, description: string, tags: string[] }) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Plug className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription className="pt-2 flex-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
