import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Privacy <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Your data security and privacy are fundamental to our architecture.
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

              <h2>1. Introduction</h2>
              <p>
                At FnSkills, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our cloud-based, multi-tenant Learning Management System (LMS) platform.
              </p>

              <h2>2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways, including:</p>
              <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed.</li>
                <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase a subscription.</li>
              </ul>

              <h2>3. Multi-Tenant Data Isolation</h2>
              <p>
                As a multi-tenant platform, your institutional data is logically separated from other tenants. We employ strict access controls and database schemas to ensure that user data from one organization cannot be accessed by users from another organization.
              </p>

              <h2>4. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Process your transactions and send related information.</li>
                <li>Send administrative information to you, such as updates to our terms, conditions, and policies.</li>
                <li>Respond to customer service requests and provide support.</li>
              </ul>

              <h2>5. Disclosure of Your Information</h2>
              <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
              <ul>
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.</li>
              </ul>

              <h2>6. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>

              <h2>7. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <p>privacy@fnskills.com</p>

            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
