import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, MonitorPlay, FileCheck, Code, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/marketing'

export const metadata: Metadata = {
  title: 'Documentation — Fnskills LMS',
  description: 'Comprehensive guides for students and instructors. Learn how to navigate courses, build curriculum, manage grades, and more with Fnskills.',
  openGraph: {
    title: 'Fnskills Documentation',
    description: 'Step-by-step guides for students, instructors, and administrators using the Fnskills platform.',
  },
}

export default function DocumentationOverview() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Documentation Overview</h2>

      <p className="text-muted-foreground text-lg mb-8">
        Welcome to the Fnskills documentation. Select a guide below to explore detailed workflows and features.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="group rounded-none border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:hover:translate-y-0">
          <CardHeader>
            <IconBox icon={Book} className="mb-3" />
            <CardTitle>Student Guide</CardTitle>
            <CardDescription>Everything students need to know to navigate courses, submit assignments, and interact.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="lg" className="w-full justify-between rounded-full group-hover:border-primary/40" asChild>
              <Link href="/documentation/student/dashboard">
                View Student Docs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group rounded-none border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:hover:translate-y-0">
          <CardHeader>
            <IconBox icon={MonitorPlay} className="mb-3" />
            <CardTitle>Instructor Guide</CardTitle>
            <CardDescription>Learn how to build courses, manage grades, and engage with your students effectively.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="lg" className="w-full justify-between rounded-full group-hover:border-primary/40" asChild>
              <Link href="/documentation/instructor/course-builder">
                View Instructor Docs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border-dashed border-border/60 bg-muted/30 shadow-none">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted ring-1 ring-border"><FileCheck className="h-6 w-6 text-muted-foreground" aria-hidden="true" /></div>
            <CardTitle>Admin Guide</CardTitle>
            <CardDescription>
              Configuration, user management, and institution settings.
              <span className="block w-fit mt-3 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-none border-dashed border-border/60 bg-muted/30 shadow-none">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted ring-1 ring-border"><Code className="h-6 w-6 text-muted-foreground" aria-hidden="true" /></div>
            <CardTitle>Developer API</CardTitle>
            <CardDescription>
              Integrate Fnskills with your existing tools using our RESTful API.
              <span className="block w-fit mt-3 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
