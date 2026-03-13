import { type ComponentType } from 'react'
import {
  DashboardIcon,
  TenantsIcon,
  BillingIcon,
  AnalyticsIcon,
  TransactionsIcon,
  UsersIcon,
  CoursesIcon,
  BrandingIcon,
  RolesIcon,
  SettingsIcon,
  SecurityIcon,
  SupportIcon,
  ModulesIcon,
  AuditLogsIcon,
} from '@/components/admin/colored-icons'

export interface NavItem {
  title: string
  href: string
  icon: ComponentType<{ className?: string }>
  section: string
  badge?: string
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/super-admin',
    icon: DashboardIcon,
    section: 'Main',
  },
  {
    title: 'Tenants',
    href: '/super-admin/tenants',
    icon: TenantsIcon,
    section: 'Management',
  },
  {
    title: 'Subscriptions & Billing',
    href: '/super-admin/billing',
    icon: BillingIcon,
    section: 'Management',
  },
  {
    title: 'Analytics',
    href: '/super-admin/analytics',
    icon: AnalyticsIcon,
    section: 'Analytics',
  },
  {
    title: 'Transactions',
    href: '/super-admin/transactions',
    icon: TransactionsIcon,
    section: 'Analytics',
  },
  {
    title: 'Users',
    href: '/super-admin/users',
    icon: UsersIcon,
    section: 'Management',
  },
  {
    title: 'Courses',
    href: '/super-admin/courses',
    icon: CoursesIcon,
    section: 'Management',
  },
  {
    title: 'Branding & CMS',
    href: '/super-admin/branding',
    icon: BrandingIcon,
    section: 'Configuration',
  },
  {
    title: 'Roles & Permissions',
    href: '/super-admin/roles',
    icon: RolesIcon,
    section: 'Configuration',
  },
  {
    title: 'Settings',
    href: '/super-admin/settings',
    icon: SettingsIcon,
    section: 'System',
  },
  {
    title: 'Security',
    href: '/super-admin/security',
    icon: SecurityIcon,
    section: 'System',
  },
  {
    title: 'Support & Tickets',
    href: '/super-admin/support',
    icon: SupportIcon,
    section: 'Support',
  },
  {
    title: 'Modules',
    href: '/super-admin/modules',
    icon: ModulesIcon,
    section: 'Configuration',
  },
  {
    title: 'Audit Logs',
    href: '/super-admin/audit-logs',
    icon: AuditLogsIcon,
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
