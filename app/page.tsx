import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BookOpen,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cloud,
  LayoutDashboard,
  ShieldCheck,
  Building,
  GraduationCap,
  Globe
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fnskillslogo11W.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto dark:hidden" priority />
              <Image src="/fnskillslogo11.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto hidden dark:block" priority />
            </Link>
            <div className="dark:hidden">

            </div>
            <div className="hidden dark:block">

            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#audience" className="transition-colors hover:text-primary">For Who</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Cloud className="mr-2 h-4 w-4" />
              <span>Cloud-Based Multi-Tenant Infrastructure</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Your Institution's Platform, <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Your Sub-domain</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              FnSkills enables Universities, Colleges of Education, Private Organizations, and other institutions to launch their own branded Learning Management System instantly. Subscribe and get your dedicated dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg group">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg bg-background/50 backdrop-blur-sm">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-6xl mt-12 animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-3xl rounded-[3rem]"></div>
              <div className="rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
                <div className="rounded-xl overflow-hidden border border-border bg-background">
                  <Image
                    src="/dashboard-preview.png"
                    alt="FnSkills Dashboard Preview"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section id="audience" className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Empowering Every Learning Environment</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our multi-tenant architecture is built to scale and adapt to the unique needs of various educational organizations.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Building, title: "Universities & Colleges", desc: "Manage multiple faculties, departments, and thousands of students efficiently." },
                { icon: GraduationCap, title: "K-12 Schools", desc: "Streamline communication between teachers, students, and parents." },
                { icon: Globe, title: "Corporate Training", desc: "Onboard employees and track compliance training with robust reporting." },
                { icon: Users, title: "Private Tutors", desc: "Professionalize your offering with a branded portal for your students." }
              ].map((item, i) => (
                <div key={i} className="text-center p-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Launch Your Academy in Minutes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No complex technical setup required. We handle the infrastructure so you can focus on education.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0"></div>

              {[
                { step: "01", title: "Choose a Plan", desc: "Select the subscription tier that fits your institution's size and needs." },
                { step: "02", title: "Claim Sub-domain", desc: "Get a dedicated URL (e.g., yourschool.fnskills.com) for your branded portal." },
                { step: "03", title: "Start Teaching", desc: "Upload courses, invite instructors, and enroll students immediately." }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/10"></div>
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-Grade Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage a modern educational institution under one roof.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Cloud className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Multi-Tenant Architecture</CardTitle>
                  <CardDescription>
                    Secure, isolated environments for every institution. Your data is kept strictly separate while benefiting from shared cloud infrastructure.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>White-Labeled Dashboards</CardTitle>
                  <CardDescription>
                    Customize the look and feel. Use your own logos, brand colors, and dedicated sub-domain to maintain institutional identity.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Role-Based Access Control</CardTitle>
                  <CardDescription>
                    Granular permissions with dedicated portals for Super Admins, School Admins, Instructors, and Students.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Robust Curriculum Builder</CardTitle>
                  <CardDescription>
                    Create complex course structures, modules, and lessons. Support for multimedia content, assignments, and live classes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Advanced Assessments</CardTitle>
                  <CardDescription>
                    Comprehensive quizzing engine, assignment submissions, automated grading, and detailed performance analytics.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real-time Analytics</CardTitle>
                  <CardDescription>
                    Track attendance, engagement metrics, financial data, and overall institutional health through intuitive visual dashboards.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials / Trust Section */}
        <section className="py-20 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-medium text-muted-foreground mb-8">Trusted by forward-thinking institutions</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <Image src="/placeholder-logo.svg" alt="Partner Logo" width={120} height={40} className="h-8 w-auto" />
              <Image src="/placeholder-logo.svg" alt="Partner Logo" width={120} height={40} className="h-8 w-auto" />
              <Image src="/placeholder-logo.svg" alt="Partner Logo" width={120} height={40} className="h-8 w-auto" />
              <Image src="/placeholder-logo.svg" alt="Partner Logo" width={120} height={40} className="h-8 w-auto" />
              <Image src="/placeholder-logo.svg" alt="Partner Logo" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Transparent Pricing for Every Scale</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All plans include your own dedicated sub-domain and core LMS features.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter */}
              <Card className="flex flex-col border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for private tutors and small training centers.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Up to 500 Students</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Branded Sub-domain</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Basic Course Builder</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Standard Support</li>
                  </ul>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* Professional */}
              <Card className="flex flex-col border-primary shadow-lg relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
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
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Up to 5,000 Students</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Branded Sub-domain</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Advanced Analytics</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Custom White-labeling</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Priority Support</li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="flex flex-col border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For universities and large educational networks.</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground">
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Unlimited Students</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Multiple Sub-domains</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> API Access</li>
                    <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-primary mr-2" /> Dedicated Account Manager</li>
                  </ul>
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to launch your institution's portal?</h2>
                <p className="text-primary-foreground/90 text-lg mb-10 max-w-2xl mx-auto">
                  Join the growing network of educational organizations leveraging FnSkills' cloud infrastructure.
                </p>
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                    Create Your Account Now
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-20 blur-3xl">
                <div className="w-96 h-96 rounded-full bg-white"></div>
              </div>
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 opacity-20 blur-3xl">
                <div className="w-96 h-96 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Image src="/fnskillslogo11.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto mb-6" />
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Empowering institutions with cloud-based, multi-tenant learning infrastructure.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4 tracking-wide">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4 tracking-wide">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4 tracking-wide">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FnSkills. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer></div>
  )
}
