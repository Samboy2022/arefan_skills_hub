import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  CtaBanner,
  PageHero,
  SectionHeader,
  containerClasses,
  mutedSectionClasses,
  sectionClasses,
} from '@/components/marketing'
import { cn } from '@/lib/utils'
import { CheckCircle2, Minus, Tag } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Arefan Skills Hub LMS',
  description: 'Transparent pricing for tutors, schools, and universities. Start with a free trial and upgrade as your institution grows.',
}

const planCardClasses =
  'flex h-full flex-col rounded-2xl border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0'
const planButtonClasses = 'w-full rounded-full'

const faqs = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time from your administrator dashboard. Prorated charges will be applied automatically.',
  },
  {
    q: 'What happens if I exceed my student limit?',
    a: 'If you go slightly over your limit, your service will not be interrupted. We will contact you to discuss upgrading to a tier that better suits your current volume.',
  },
  {
    q: 'Do you offer discounts for non-profits?',
    a: 'Yes! We offer a 20% discount on all plans for registered non-profit organizations and public schools. Please contact our sales team with proof of your 501(c)(3) or equivalent status.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          badge="Free trial on every plan"
          badgeIcon={Tag}
          title="Transparent Pricing for Every"
          highlight="Scale"
          description="No hidden fees. No complex contracts. Choose the plan that fits your institution's needs and upgrade as you grow."
        />

        <section className={sectionClasses}>
          <div className={cn(containerClasses, 'max-w-6xl')}>
            <div className="grid items-stretch gap-8 md:grid-cols-3">
              {/* Starter */}
              <Card className={planCardClasses}>
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for private tutors and small academies.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">$49</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <PricingFeature text="Up to 100 Active Students" />
                    <PricingFeature text="5 Instructors" />
                    <PricingFeature text="Custom Subdomain" />
                    <PricingFeature text="Basic Course Builder" />
                    <PricingFeature text="Community Forums" />
                    <PricingFeature text="Standard Email Support" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={planButtonClasses} size="lg" variant="outline" asChild>
                    <Link href="/login?plan=starter">Start Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Professional */}
              <Card className={cn(planCardClasses, 'relative overflow-visible border-2 border-primary shadow-xl shadow-primary/10 md:-my-4 md:py-10')}>
                <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">Most Popular</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>For growing schools and training organizations.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">$199</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <PricingFeature text="Up to 1,000 Active Students" />
                    <PricingFeature text="25 Instructors" />
                    <PricingFeature text="Custom Domain Support" />
                    <PricingFeature text="Advanced Analytics" />
                    <PricingFeature text="Zoom & Google Meet Integration" />
                    <PricingFeature text="Automated Gradebook" />
                    <PricingFeature text="Priority Support" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={planButtonClasses} size="lg" asChild>
                    <Link href="/login?plan=professional">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise */}
              <Card className={planCardClasses}>
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For universities and large corporate teams.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <PricingFeature text="Unlimited Students" />
                    <PricingFeature text="Unlimited Instructors" />
                    <PricingFeature text="White-labeling & Custom CSS" />
                    <PricingFeature text="SSO (SAML, OAuth)" />
                    <PricingFeature text="Dedicated Account Manager" />
                    <PricingFeature text="Custom API Integrations" />
                    <PricingFeature text="On-premise deployment options" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={planButtonClasses} size="lg" variant="outline" asChild>
                    <Link href="/contact?team=sales">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className={cn(sectionClasses, mutedSectionClasses)}>
           <div className={cn(containerClasses, 'max-w-6xl')}>
              <SectionHeader eyebrow="Compare" title="Compare Plan Features" />
              <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-sm">
                 <table className="w-full min-w-[560px] text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border bg-muted/50">
                          <th className="py-4 px-6 font-semibold">Feature</th>
                          <th className="py-4 px-6 font-semibold text-center">Starter</th>
                          <th className="py-4 px-6 font-semibold text-center text-primary">Professional</th>
                          <th className="py-4 px-6 font-semibold text-center">Enterprise</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium">Multi-tenant Cloud Infra</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                       <tr className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium">Storage</td>
                          <td className="py-4 px-6 text-center text-sm">50 GB</td>
                          <td className="py-4 px-6 text-center text-sm">500 GB</td>
                          <td className="py-4 px-6 text-center text-sm">Unlimited</td>
                       </tr>
                       <tr className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium">Live Video Integrations</td>
                          <td className="py-4 px-6 text-center"><Minus className="h-5 w-5 mx-auto text-muted-foreground/60" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                       <tr className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium">Single Sign-On (SSO)</td>
                          <td className="py-4 px-6 text-center"><Minus className="h-5 w-5 mx-auto text-muted-foreground/60" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><Minus className="h-5 w-5 mx-auto text-muted-foreground/60" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-primary" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        <section className={sectionClasses}>
          <div className={cn(containerClasses, 'max-w-3xl')}>
            <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
            <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-2xl border border-border/60 bg-card px-6 shadow-sm">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border/60">
                  <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline hover:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <CtaBanner
          title="Need a custom solution?"
          description="If you have specific compliance requirements, need custom API development, or require on-premise hosting, our engineering team is ready to help."
          primary={{ label: 'Contact Enterprise Sales', href: '/contact?team=sales' }}
          secondary={{ label: 'Start Free Trial', href: '/login' }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
      <span className="text-sm">{text}</span>
    </li>
  )
}
