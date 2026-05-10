"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, ChevronRight, ChevronDown, MonitorPlay, FileCheck, CheckCircle } from 'lucide-react'

export function DocSidebar() {
  const pathname = usePathname()

  const [studentOpen, setStudentOpen] = useState(pathname.includes('/documentation/student') || pathname === '/documentation')
  const [instructorOpen, setInstructorOpen] = useState(pathname.includes('/documentation/instructor'))

  return (
    <div className="sticky top-24">
      <h3 className="font-bold text-lg mb-4">Contents</h3>
      <nav className="space-y-1">

        {/* Overview */}
        <Link href="/documentation" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === '/documentation' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
           <Book className="h-4 w-4" />
           <span className="text-sm">Overview</span>
        </Link>

        {/* Student Guide */}
        <div>
          <button
            onClick={() => setStudentOpen(!studentOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${pathname.includes('/documentation/student') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <div className="flex items-center gap-3">
              <Book className="h-4 w-4" />
              <span className="text-sm">Student Guide</span>
            </div>
            {studentOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {studentOpen && (
            <div className="pl-6 space-y-1 border-l border-border ml-3 mt-1 mb-4">
              <DocSubLink href="/documentation/student/dashboard" title="1. Dashboard & Login" />
              <DocSubLink href="/documentation/student/assignments" title="2. Submitting Assignments" />
              <DocSubLink href="/documentation/student/quizzes" title="3. Taking Quizzes" />
              <DocSubLink href="/documentation/student/community" title="4. Community Forums" />
            </div>
          )}
        </div>

        {/* Instructor Guide */}
        <div>
          <button
            onClick={() => setInstructorOpen(!instructorOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${pathname.includes('/documentation/instructor') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <div className="flex items-center gap-3">
              <MonitorPlay className="h-4 w-4" />
              <span className="text-sm">Instructor Guide</span>
            </div>
            {instructorOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {instructorOpen && (
            <div className="pl-6 space-y-1 border-l border-border ml-3 mt-1">
              <DocSubLink href="/documentation/instructor/course-builder" title="1. Course Builder" />
              <DocSubLink href="/documentation/instructor/live-classes" title="2. Live Classes" />
              <DocSubLink href="/documentation/instructor/assessments" title="3. Assessments & Quizzes" />
              <DocSubLink href="/documentation/instructor/gradebook" title="4. Gradebook" />
              <DocSubLink href="/documentation/instructor/schedule" title="5. Schedule" />
              <DocSubLink href="/documentation/instructor/engagement" title="6. Engagement" />
            </div>
          )}
        </div>

        <div className="pt-4">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
             <FileCheck className="h-4 w-4" />
             <span className="text-sm">Admin Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
             <CheckCircle className="h-4 w-4" />
             <span className="text-sm">API Reference</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

function DocSubLink({ href, title }: { href: string, title: string }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link href={href} className={`block px-3 py-1.5 text-sm transition-colors ${active ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
      {title}
    </Link>
  )
}
