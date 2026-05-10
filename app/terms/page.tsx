import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        <section className="py-24 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: October 20, 2024</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Please read these Terms of Service ("Terms") carefully before using the FnSkills platform. By accessing or using our services, you agree to be bound by these Terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By creating an institution account or logging in as a user, you agree to these Terms. If you do not agree to all the terms and conditions, you may not access the service.
              </p>

              <h2>2. Institutional Responsibilities</h2>
              <p>
                As an institution administrator, you are responsible for:
              </p>
              <ul>
                <li>Maintaining the confidentiality of your administrative credentials.</li>
                <li>The content (courses, materials, assessments) uploaded to your dedicated subdomain.</li>
                <li>Ensuring you have the necessary rights and licenses for any intellectual property you distribute through the platform.</li>
                <li>Managing the behavior of your instructors and students.</li>
              </ul>

              <h2>3. Acceptable Use</h2>
              <p>
                You agree not to use the platform to:
              </p>
              <ul>
                <li>Upload or transmit any malicious code or viruses.</li>
                <li>Distribute unlawful, harassing, defamatory, or obscene content.</li>
                <li>Attempt to bypass or exploit our multi-tenant security architecture.</li>
              </ul>

              <h2>4. Subscriptions and Payments</h2>
              <p>
                Subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time; however, there are no refunds for partial months or years unless explicitly required by law.
              </p>

              <h2>5. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2>Contact</h2>
              <p>
                For legal inquiries regarding these terms, please contact <a href="mailto:legal@fnskills.com">legal@fnskills.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
