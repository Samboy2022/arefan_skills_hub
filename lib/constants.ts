import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Wallet,
  Users,
  BookOpen,
  Palette,
  Shield,
  Settings,
  Lock,
  Headphones,
  Zap,
  Bell,
  FileText,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  section: string
  badge?: string
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/super-admin',
    icon: LayoutDashboard,
    section: 'Main',
  },
  {
    title: 'Tenants',
    href: '/super-admin/tenants',
    icon: Building2,
    section: 'Management',
  },
  {
    title: 'Subscriptions & Billing',
    href: '/super-admin/billing',
    icon: CreditCard,
    section: 'Management',
  },
  {
    title: 'Analytics',
    href: '/super-admin/analytics',
    icon: BarChart3,
    section: 'Analytics',
  },
  {
    title: 'Transactions',
    href: '/super-admin/transactions',
    icon: Wallet,
    section: 'Analytics',
  },
  {
    title: 'Users',
    href: '/super-admin/users',
    icon: Users,
    section: 'Management',
  },
  {
    title: 'Courses',
    href: '/super-admin/courses',
    icon: BookOpen,
    section: 'Management',
  },
  {
    title: 'Branding & CMS',
    href: '/super-admin/branding',
    icon: Palette,
    section: 'Configuration',
  },
  {
    title: 'Roles & Permissions',
    href: '/super-admin/roles',
    icon: Shield,
    section: 'Configuration',
  },
  {
    title: 'Settings',
    href: '/super-admin/settings',
    icon: Settings,
    section: 'System',
  },
  {
    title: 'Security',
    href: '/super-admin/security',
    icon: Lock,
    section: 'System',
  },
  {
    title: 'Support & Tickets',
    href: '/super-admin/support',
    icon: Headphones,
    section: 'Support',
  },
  {
    title: 'Modules',
    href: '/super-admin/modules',
    icon: Zap,
    section: 'Configuration',
  },
  {
    title: 'Audit Logs',
    href: '/super-admin/audit-logs',
    icon: FileText,
    section: 'System',
  },
]

export const getNavSections = () => {
  const sections = new Map<string, NavItem[]>()
  navItems.forEach((item) => {
    if (!sections.has(item.section)) {
      sections.set(item.section, [])
    }
    sections.get(item.section)?.push(item)
  })
  return Array.from(sections.entries())
}
