import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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
import { HeroTextRotator } from '@/components/hero-text-rotator'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Cloud className="mr-2 h-4 w-4" />
              <span>Enterprise-Grade Multi-Tenant Infrastructure</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 flex flex-col items-center justify-center gap-2">
              <span>Your Institution's</span>
              <HeroTextRotator />
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed">
              Instantly deploy a secure, branded learning environment. FnSkills provides the cloud infrastructure so you can focus on delivering exceptional educational experiences without the IT overhead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
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

        {/* Core Integrations & Features Section */}
        <section className="py-24 bg-muted/10 border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Seamlessly Integrated. Infinitely Scalable.</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                FnSkills connects with the tools your institution already uses, creating a unified educational ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Video Conferencing</CardTitle>
                  <CardDescription>Native integrations with Zoom, Google Meet, and Microsoft Teams for seamless live classes.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Enterprise SSO</CardTitle>
                  <CardDescription>Support for SAML, OAuth, and Active Directory to ensure secure, one-click access for your users.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Plagiarism Detection</CardTitle>
                  <CardDescription>Automated scanning of student submissions via Turnitin and CopyLeaks integrations.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
               <Link href="/integrations">
                 <Button size="lg" variant="default" className="px-8">View All Integrations</Button>
               </Link>
               <Link href="/features">
                 <Button size="lg" variant="outline" className="px-8">Explore Features</Button>
               </Link>
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
      <SiteFooter /></div>
  )
}
