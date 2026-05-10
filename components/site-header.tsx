import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/fnskillslogo11W.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto dark:hidden" priority />
            <Image src="/fnskillslogo11.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto hidden dark:block" priority />
          </Link>
          <div className="dark:hidden"></div>
          <div className="hidden dark:block"></div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/features" className="transition-colors hover:text-primary">Features</Link>
          <Link href="/pricing" className="transition-colors hover:text-primary">Pricing</Link>
          <Link href="/integrations" className="transition-colors hover:text-primary">Integrations</Link>
          <Link href="/documentation" className="transition-colors hover:text-primary">Docs</Link>
          <Link href="/about" className="transition-colors hover:text-primary">About</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:inline-block">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/login" className="hidden md:inline-block">
            <Button>Get Started</Button>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
