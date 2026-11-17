import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, Building2, Users2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { IconBox, cardClasses, containerClasses } from '@/components/marketing';
import { cn } from '@/lib/utils';

const ROLES = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    description: 'Manage platform, schools, and system settings',
    icon: ShieldAlert,
    path: '/login/super-admin',
  },
  {
    id: 'school-admin',
    label: 'School Admin',
    description: 'Manage school operations and academic functions',
    icon: Building2,
    path: '/login/school-admin',
  },
  {
    id: 'instructor',
    label: 'Instructor',
    description: 'Create courses, assignments, and manage students',
    icon: Users2,
    path: '/login/instructor',
  },
  {
    id: 'student',
    label: 'Student',
    description: 'Access courses, submit assignments, and track grades',
    icon: BookOpen,
    path: '/login/student',
  },
];

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
      />

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <main className={cn(containerClasses, 'flex flex-1 flex-col justify-center py-16 md:py-24')}>
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Link
            href="/"
            className="mb-8 inline-flex rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Image src="/arefanskillshub3.png" alt="Arefan Skills Hub home" width={220} height={100} className="h-14 w-auto dark:hidden" priority />
            <Image src="/arefanskillshub_white.png" alt="Arefan Skills Hub home" width={889} height={304} className="hidden h-14 w-auto dark:block" priority />
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Log in</p>
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Choose Your Role</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Select your role to access the right portal for your learning journey.
          </p>
        </div>

        {/* Role Selection Grid */}
        <ul className="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => (
            <li key={role.id} className={cn(cardClasses, 'flex flex-col text-center')}>
              <IconBox icon={role.icon} className="mx-auto mb-5" />
              <h2 className="mb-2 text-lg font-semibold tracking-tight">{role.label}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{role.description}</p>

              <div className="mt-auto pt-6">
                <Button asChild size="xl" className="w-full shadow-none">
                  {/* The stretched link makes the whole card clickable */}
                  <Link
                    href={role.path}
                    aria-label={`Continue as ${role.label}`}
                    className="after:absolute after:inset-0 after:rounded-none"
                  >
                    Continue
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer Info */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Registering a school?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">Request a subdomain</Link>
          {' '}· Need help?{' '}
          <Link href="/help-center" className="font-medium text-primary hover:underline">Contact support</Link>
          {' '}or{' '}
          <Link href="/documentation" className="font-medium text-primary hover:underline">view documentation</Link>
        </p>
      </main>
    </div>
  );
}
