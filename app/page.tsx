import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, GraduationCap, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">FnSkills</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#testimonials" className="transition-colors hover:text-primary">Testimonials</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
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
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <Zap className="mr-2 h-4 w-4" />
              <span>Advanced Learning Management System</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
              Empowering growth through <span className="text-primary">skill-based</span> learning
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A comprehensive platform for skills development, course management, and educational tracking. Elevate your organization's learning journey with FnSkills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to succeed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed to streamline education management and enhance the learning experience for everyone.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    Create, organize, and deliver engaging content with our intuitive curriculum builder.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Role-Based Access</CardTitle>
                  <CardDescription>
                    Dedicated portals for Super Admins, School Admins, Instructors, and Students.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Monitor performance with detailed analytics and comprehensive skill assessments.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your educational experience?</h2>
                <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
                  Join thousands of educators and learners who are already using FnSkills to achieve their goals.
                </p>
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
                    Create Your Account
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 blur-3xl">
                <div className="w-96 h-96 rounded-full bg-white"></div>
              </div>
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 opacity-10 blur-3xl">
                <div className="w-96 h-96 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">FnSkills</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FnSkills. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
