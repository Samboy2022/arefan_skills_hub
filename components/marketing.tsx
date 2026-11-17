import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Shared building blocks for the public marketing pages.             */
/*  Keep these in sync with the landing page look & feel.              */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>

export const sectionClasses = 'py-20 md:py-28'
export const containerClasses = 'container mx-auto px-4 sm:px-6 lg:px-8'
export const mutedSectionClasses = 'border-y border-border/60 bg-muted/40'
export const cardClasses =
  'group relative h-full overflow-hidden rounded-none border border-border/60 bg-card p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0'
export const gradientTextClasses =
  'text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-green-400'

export function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlight,
  description,
  children,
}: {
  badge?: string
  badgeIcon?: IconType
  title: React.ReactNode
  highlight?: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 pt-16 pb-16 md:pt-24 md:pb-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
      />
      <div className={cn(containerClasses, 'max-w-4xl text-center')}>
        {badge && (
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            {BadgeIcon && <BadgeIcon className="mr-2 h-3.5 w-3.5" />}
            {badge}
          </div>
        )}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
          {highlight && (
            <>
              {' '}
              <span className={gradientTextClasses}>{highlight}</span>
            </>
          )}
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
          {description}
        </p>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('mx-auto mb-12 max-w-2xl text-center md:mb-16', className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </div>
  )
}

/** Left-aligned heading with icon, for pages grouped into categories. */
export function CategoryHeader({
  icon,
  title,
  description,
}: {
  icon: IconType
  title: string
  description?: string
}) {
  return (
    <div className="mb-10 flex items-center gap-4 border-b border-border/60 pb-6">
      <IconBox icon={icon} className="h-14 w-14 shrink-0" />
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function IconBox({ icon: Icon, className }: { icon: IconType; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary/15',
        className
      )}
    >
      <Icon className="h-6 w-6 text-primary" />
    </div>
  )
}

export function InfoCard({
  icon,
  title,
  description,
  centered = false,
  children,
}: {
  icon?: IconType
  title: React.ReactNode
  description: string
  centered?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={cn(cardClasses, 'flex flex-col', centered && 'text-center')}>
      {icon && <IconBox icon={icon} className={cn('mb-5', centered && 'mx-auto')} />}
      <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children && <div className="mt-auto pt-5">{children}</div>}
    </div>
  )
}

export function CtaBanner({
  title,
  description,
  primary = { label: 'Create Your Account', href: '/login' },
  secondary,
}: {
  title: string
  description: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:px-10 md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute -top-40 -right-24 -z-10 h-80 w-80 rounded-full bg-white/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-24 -z-10 h-80 w-80 rounded-full bg-black/10 blur-3xl"
          />

          <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
            {description}
          </p>
          <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Button
              asChild
              size="xl"
              className="group bg-background text-foreground shadow-lg hover:bg-background/90"
            >
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            {secondary && (
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:border-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground dark:bg-transparent dark:hover:bg-primary-foreground/10"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
