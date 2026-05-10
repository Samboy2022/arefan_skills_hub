import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        <section className="py-24 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: October 20, 2024</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                At FnSkills, we are committed to protecting the privacy and security of your data. This Privacy Policy outlines how we collect, use, and safeguard your personal and institutional information.
              </p>

              <h2>1. Multi-Tenant Data Isolation</h2>
              <p>
                FnSkills operates on a multi-tenant cloud architecture. Your institutional data is logically isolated from all other tenants. We employ strict database-level security policies to ensure that cross-tenant data access is impossible under normal operating conditions.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you create an account, build a curriculum, or interact with the platform. For students, this includes enrollment data, assignment submissions, and assessment scores.
              </p>

              <h2>3. How We Use Your Information</h2>
              <ul>
                <li>To provide, maintain, and improve the platform.</li>
                <li>To process transactions and send related information, including confirmations and receipts.</li>
                <li>To send technical notices, updates, security alerts, and support messages.</li>
                <li>To respond to your comments, questions, and requests.</li>
              </ul>

              <h2>4. Third-Party Integrations</h2>
              <p>
                If you choose to utilize third-party integrations (e.g., Zoom, Stripe), you are authorizing us to share necessary data with those services. We encourage you to review the privacy policies of any third-party services you connect.
              </p>

              <h2>5. Security</h2>
              <p>
                We use industry-standard security measures (including encryption in transit and at rest) to protect your data. However, no security system is impenetrable, and we cannot guarantee the absolute security of our databases.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@fnskills.com">privacy@fnskills.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
