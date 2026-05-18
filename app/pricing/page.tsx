import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Transparent Pricing for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Scale</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              No hidden fees. No complex contracts. Choose the plan that fits your institution's needs and upgrade as you grow.
            </p>
          </div>
        </section>

        <section className="py-20 -mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter */}
              <Card className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for private tutors and small academies.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold">$49</span>
                    <span className="text-muted-foreground">/month</span>
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
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup?plan=starter">Start Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Professional */}
              <Card className="flex flex-col relative border-primary shadow-md hover:shadow-lg transition-shadow z-10">
                <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-lg" />
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>For growing schools and training organizations.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold">$199</span>
                    <span className="text-muted-foreground">/month</span>
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
                  <Button className="w-full" asChild>
                    <Link href="/signup?plan=professional">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise */}
              <Card className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For universities and large corporate teams.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold">Custom</span>
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
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/contact?team=sales">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/10 border-y border-border/50">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-12">Compare Plan Features</h2>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border">
                          <th className="py-4 px-6 font-semibold">Feature</th>
                          <th className="py-4 px-6 font-semibold text-center">Starter</th>
                          <th className="py-4 px-6 font-semibold text-center text-primary">Professional</th>
                          <th className="py-4 px-6 font-semibold text-center">Enterprise</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6">Multi-tenant Cloud Infra</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                       <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6">Storage</td>
                          <td className="py-4 px-6 text-center text-sm">50 GB</td>
                          <td className="py-4 px-6 text-center text-sm">500 GB</td>
                          <td className="py-4 px-6 text-center text-sm">Unlimited</td>
                       </tr>
                       <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6">Live Video Integrations</td>
                          <td className="py-4 px-6 text-center"><XCircle className="h-5 w-5 mx-auto text-muted-foreground" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                       <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6">Single Sign-On (SSO)</td>
                          <td className="py-4 px-6 text-center"><XCircle className="h-5 w-5 mx-auto text-muted-foreground" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><XCircle className="h-5 w-5 mx-auto text-muted-foreground" aria-hidden="true" /><span className="sr-only">Not included</span></td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 className="h-5 w-5 mx-auto text-green-500" aria-hidden="true" /><span className="sr-only">Included</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        <section className="py-20">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-bold mb-2">Can I switch plans later?</h3>
                    <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time from your administrator dashboard. Prorated charges will be applied automatically.</p>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">What happens if I exceed my student limit?</h3>
                    <p className="text-muted-foreground">If you go slightly over your limit, your service will not be interrupted. We will contact you to discuss upgrading to a tier that better suits your current volume.</p>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold mb-2">Do you offer discounts for non-profits?</h3>
                    <p className="text-muted-foreground">Yes! We offer a 20% discount on all plans for registered non-profit organizations and public schools. Please contact our sales team with proof of your 501(c)(3) or equivalent status.</p>
                 </div>
              </div>
           </div>
        </section>

        <section className="py-20 bg-primary/5 border-t border-border/50 text-center">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
              <p className="text-lg text-muted-foreground mb-8">If you have specific compliance requirements, need custom API development, or require on-premise hosting, our engineering team is ready to help.</p>
              <Button size="lg" className="px-8" asChild>
                <Link href="/contact?team=sales">Contact Enterprise Sales</Link>
              </Button>
           </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  )
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </li>
  )
}
