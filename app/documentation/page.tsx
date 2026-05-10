import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, MonitorPlay, FileCheck, Code, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DocumentationOverview() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold border-b border-border pb-4 mb-8">Documentation Overview</h2>

      <p className="text-muted-foreground text-lg mb-8">
        Welcome to the FnSkills documentation. Select a guide below to explore detailed workflows and features.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Student Guide</CardTitle>
            <CardDescription>Everything students need to know to navigate courses, submit assignments, and interact.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/documentation/student/dashboard">
              <Button variant="outline" className="w-full justify-between">
                View Student Docs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <MonitorPlay className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Instructor Guide</CardTitle>
            <CardDescription>Learn how to build courses, manage grades, and engage with your students effectively.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/documentation/instructor/course-builder">
              <Button variant="outline" className="w-full justify-between">
                View Instructor Docs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors opacity-75 cursor-not-allowed">
          <CardHeader>
            <FileCheck className="h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle>Admin Guide</CardTitle>
            <CardDescription>Configuration, user management, and institution settings. (Coming Soon)</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors opacity-75 cursor-not-allowed">
          <CardHeader>
            <Code className="h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle>Developer API</CardTitle>
            <CardDescription>Integrate FnSkills with your existing tools using our RESTful API. (Coming Soon)</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
