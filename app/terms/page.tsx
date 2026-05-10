import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Terms of <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              The rules, guidelines, and agreements for using FnSkills.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">

              <Card className="p-6 mb-8 bg-muted/20 border-l-4 border-l-primary rounded-l-none">
                <p className="m-0 font-medium text-foreground">Last Updated: May 10, 2024</p>
              </Card>

              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using the FnSkills platform ("Site" or "Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
              </p>

              <h2>2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
              </p>

              <h2>3. User Representations</h2>
              <p>By using the Site, you represent and warrant that:</p>
              <ul>
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
              </ul>

              <h2>4. Subscription and Billing</h2>
              <p>
                Our services are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
              </p>

              <h2>5. Prohibited Activities</h2>
              <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
              <p>Systematic retrieval of data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us is prohibited.</p>

              <h2>6. Institutional Admin Responsibilities</h2>
              <p>
                If you are an Administrator for an institution using our multi-tenant infrastructure, you are responsible for managing the users (students, instructors) within your subdomain. You must ensure that content uploaded to your subdomain complies with all applicable local and international copyright laws.
              </p>

              <h2>7. Modifications and Interruptions</h2>
              <p>
                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed by and defined following the laws of the jurisdiction in which FnSkills operates. FnSkills and yourself irrevocably consent that the courts of that jurisdiction shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
              </p>

            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
