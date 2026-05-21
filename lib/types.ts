export interface Tenant {
  id: string
  name: string
  domain: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'trial' | 'suspended' | 'pending'
  students: number
  courses: number
  createdAt: Date
  lastLogin?: Date
}

export interface Subscription {
  id: string
  tenantId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due'
  amount: number
  billingCycle: 'monthly' | 'annual'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  nextBillingDate?: Date
}

export interface Transaction {
  id: string
  tenantId: string
  amount: number
  currency: string
  type: 'payment' | 'refund' | 'adjustment'
  status: 'completed' | 'pending' | 'failed'
  description: string
  createdAt: Date
}

export interface UserRecord {
  id: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  tenantId?: string
  status: 'active' | 'suspended' | 'pending'
  createdAt: Date
  lastLogin?: Date
}

export interface Course {
  id: string
  tenantId: string
  title: string
  instructor: string
  students: number
  status: 'published' | 'draft' | 'flagged'
  createdAt: Date
}

export interface KPIMetric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: string
}

export interface ChartData {
  name: string
  value?: number
  [key: string]: any
}
