import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Simple, Transparent <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Choose the plan that fits your institution's size. No hidden fees, cancel anytime.
            </p>
            {/* Toggle switch placeholder */}
            <div className="inline-flex items-center justify-center p-1 bg-muted rounded-full mb-8">
              <button className="px-6 py-2 rounded-full bg-background shadow-sm text-sm font-medium">Monthly billing</button>
              <button className="px-6 py-2 rounded-full text-muted-foreground text-sm font-medium">Annual billing <span className="text-green-500 text-xs ml-1 font-bold">-20%</span></button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 -mt-20 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <Card className="flex flex-col border-border/50 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for private tutors and small training centers.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <FeatureItem text="Up to 500 Students" />
                    <FeatureItem text="Up to 5 Instructors" />
                    <FeatureItem text="Branded Sub-domain" />
                    <FeatureItem text="Basic Course Builder" />
                    <FeatureItem text="Standard Support" />
                    <FeatureItem text="50GB Storage" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </CardFooter>
              </Card>

              {/* Professional Plan */}
              <Card className="flex flex-col border-primary shadow-2xl relative transform md:-translate-y-4 bg-card">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>Ideal for growing colleges and corporate teams.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$299</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <FeatureItem text="Up to 5,000 Students" />
                    <FeatureItem text="Up to 50 Instructors" />
                    <FeatureItem text="Branded Sub-domain" />
                    <FeatureItem text="Advanced Analytics" />
                    <FeatureItem text="Custom White-labeling" />
                    <FeatureItem text="API Access" />
                    <FeatureItem text="Priority Support" />
                    <FeatureItem text="500GB Storage" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Free Trial</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="flex flex-col border-border/50 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For universities and large educational networks.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <FeatureItem text="Unlimited Students" />
                    <FeatureItem text="Unlimited Instructors" />
                    <FeatureItem text="Multiple Sub-domains" />
                    <FeatureItem text="Advanced API & Integrations" />
                    <FeatureItem text="Dedicated Account Manager" />
                    <FeatureItem text="SLA & Custom Contracts" />
                    <FeatureItem text="Unlimited Storage" />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Compare Plan Features</h2>
              <p className="text-muted-foreground mt-4">A detailed breakdown of what's included in every tier.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-6 font-medium text-muted-foreground w-1/3">Feature</th>
                    <th className="py-4 px-6 font-semibold text-center">Starter</th>
                    <th className="py-4 px-6 font-semibold text-center text-primary">Professional</th>
                    <th className="py-4 px-6 font-semibold text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {/* Category */}
                  <tr>
                    <td colSpan={4} className="py-4 px-6 font-bold bg-background/50 text-foreground">Core Features</td>
                  </tr>
                  <TableRow name="Custom Subdomain" starter={true} pro={true} enterprise={true} />
                  <TableRow name="Course Builder" starter={true} pro={true} enterprise={true} />
                  <TableRow name="Student Portal" starter={true} pro={true} enterprise={true} />
                  <TableRow name="Remove Branding" starter={false} pro={true} enterprise={true} />

                  {/* Category */}
                  <tr>
                    <td colSpan={4} className="py-4 px-6 font-bold bg-background/50 text-foreground mt-4">Integrations & Data</td>
                  </tr>
                  <TableRow name="Payment Gateway Integration" starter={true} pro={true} enterprise={true} />
                  <TableRow name="Basic Reports" starter={true} pro={true} enterprise={true} />
                  <TableRow name="Advanced Analytics" starter={false} pro={true} enterprise={true} />
                  <TableRow name="REST API Access" starter={false} pro={true} enterprise={true} />
                  <TableRow name="SSO Integration" starter={false} pro={false} enterprise={true} />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Scaling & Discounts Info */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Scaling & Discounts</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border p-8 rounded-2xl text-left">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-green-500">%</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Annual Billing Discount</h3>
                <p className="text-muted-foreground">
                  Commit to a year of FnSkills and receive a 20% discount on any plan. This is ideal for institutions looking for long-term stability and budget predictability.
                </p>
              </div>
              <div className="bg-card border border-border p-8 rounded-2xl text-left">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Seamless Scaling</h3>
                <p className="text-muted-foreground">
                  Need to add more students midway through the year? We automatically prorate your upgrade so you never pay twice, ensuring your platform scales exactly as you do.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center">
      <CheckCircle2 className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
      <span>{text}</span>
    </li>
  )
}

function TableRow({ name, starter, pro, enterprise }: { name: string, starter: boolean, pro: boolean, enterprise: boolean }) {
  const renderIcon = (value: boolean) => {
    return value ?
      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" /> :
      <XCircle className="h-5 w-5 text-muted/30 mx-auto" />
  }

  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="py-4 px-6 text-muted-foreground">{name}</td>
      <td className="py-4 px-6 text-center">{renderIcon(starter)}</td>
      <td className="py-4 px-6 text-center">{renderIcon(pro)}</td>
      <td className="py-4 px-6 text-center">{renderIcon(enterprise)}</td>
    </tr>
  )
}
