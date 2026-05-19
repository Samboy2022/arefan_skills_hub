import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'

const navLinkClasses = 'transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm">
            <Image src="/fnskillslogo11W.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto dark:hidden" priority />
            <Image src="/fnskillslogo11.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto hidden dark:block" priority />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/features" className={navLinkClasses}>Features</Link>
          <Link href="/pricing" className={navLinkClasses}>Pricing</Link>
          <Link href="/integrations" className={navLinkClasses}>Integrations</Link>
          <Link href="/documentation" className={navLinkClasses}>Docs</Link>
          <Link href="/about" className={navLinkClasses}>About</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:inline-block">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/login" className="hidden md:inline-block">
            <button
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full overflow-hidden hover:opacity-90 transition-opacity shadow-sm border group text-emerald-950 bg-gradient-to-tr from-white/90 via-white to-white/90 ring-2 ring-emerald-100/50 border-white dark:text-emerald-50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/20 dark:ring-primary/50 dark:border-primary/50 before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[60px] before:h-[60px] before:rounded-full before:bg-gradient-to-b before:from-primary/10 dark:before:from-primary/40 before:blur-xl"
            >
              Get Started
            </button>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
