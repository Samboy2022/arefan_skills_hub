import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, MonitorPlay, FileCheck, Code, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Documentation — Arefan Skills Hub LMS',
  description: 'Comprehensive guides for students and instructors. Learn how to navigate courses, build curriculum, manage grades, and more with Arefan Skills Hub.',
  openGraph: {
    title: 'Arefan Skills Hub Documentation',
    description: 'Step-by-step guides for students, instructors, and administrators using the Arefan Skills Hub platform.',
  },
}

export default function DocumentationOverview() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Documentation Overview</h2>

      <p className="text-muted-foreground text-lg mb-8">
        Welcome to the Arefan Skills Hub documentation. Select a guide below to explore detailed workflows and features.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="hover:shadow-lg hover:border-primary/30 transition-all">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Student Guide</CardTitle>
            <CardDescription>Everything students need to know to navigate courses, submit assignments, and interact.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/documentation/student/dashboard">
                View Student Docs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:border-primary/30 transition-all">
          <CardHeader>
            <MonitorPlay className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Instructor Guide</CardTitle>
            <CardDescription>Learn how to build courses, manage grades, and engage with your students effectively.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/documentation/instructor/course-builder">
                View Instructor Docs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <FileCheck className="h-8 w-8 text-muted-foreground mb-2" aria-hidden="true" />
            <CardTitle>Admin Guide</CardTitle>
            <CardDescription>
              Configuration, user management, and institution settings.
              <span className="inline-block mt-2 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <Code className="h-8 w-8 text-muted-foreground mb-2" aria-hidden="true" />
            <CardTitle>Developer API</CardTitle>
            <CardDescription>
              Integrate Arefan Skills Hub with your existing tools using our RESTful API.
              <span className="inline-block mt-2 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
