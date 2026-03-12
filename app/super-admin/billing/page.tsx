'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Check, X, Upload, DollarSign, Package, Users, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockSubscriptions, mockTenants } from '@/lib/mock-data'
import { format } from 'date-fns'

interface PricingTier {
  minStudents: number
  maxStudents: number
  pricePerStudent: number
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  icon?: string
  pricingModel: 'per-session' | 'per-month'
  pricingTiers: PricingTier[]
  features: string[]
  maxStorage: number
  maxCourses: number
  isPopular: boolean
  isActive: boolean
  color: string
}

const initialPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small schools and institutions getting started',
    icon: '📚',
    pricingModel: 'per-month',
    pricingTiers: [
      { minStudents: 1, maxStudents: 50, pricePerStudent: 500 },
      { minStudents: 51, maxStudents: 100, pricePerStudent: 450 },
      { minStudents: 101, maxStudents: 200, pricePerStudent: 400 },
    ],
    features: [
      'Up to 200 students',
      '10 GB storage per student',
      '5 courses',
      'Basic analytics',
      'Email support',
    ],
    maxStorage: 10,
    maxCourses: 5,
    isPopular: false,
    isActive: true,
    color: 'blue',
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Ideal for growing institutions with advanced needs',
    icon: '🎓',
    pricingModel: 'per-month',
    pricingTiers: [
      { minStudents: 1, maxStudents: 100, pricePerStudent: 450 },
      { minStudents: 101, maxStudents: 300, pricePerStudent: 400 },
      { minStudents: 301, maxStudents: 500, pricePerStudent: 350 },
      { minStudents: 501, maxStudents: 999999, pricePerStudent: 300 },
    ],
    features: [
      'Unlimited students',
      '50 GB storage per student',
      'Unlimited courses',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
    ],
    maxStorage: 50,
    maxCourses: -1,
    isPopular: true,
    isActive: true,
    color: 'purple',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    icon: '🏢',
    pricingModel: 'per-month',
    pricingTiers: [
      { minStudents: 1, maxStudents: 200, pricePerStudent: 400 },
      { minStudents: 201, maxStudents: 500, pricePerStudent: 350 },
      { minStudents: 501, maxStudents: 1000, pricePerStudent: 300 },
      { minStudents: 1001, maxStudents: 999999, pricePerStudent: 250 },
    ],
    features: [
      'Unlimited students',
      'Unlimited storage',
      'Unlimited courses',
      'Custom analytics',
      '24/7 dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    maxStorage: -1,
    maxCourses: -1,
    isPopular: false,
    isActive: true,
    color: 'orange',
  },
]

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('plans')
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    icon: '📦',
    pricingModel: 'per-month',
    pricingTiers: [{ minStudents: 1, maxStudents: 50, pricePerStudent: 500 }],
    features: [''],
    maxStorage: 0,
    maxCourses: 0,
    isPopular: false,
    isActive: true,
    color: 'blue',
  })
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>('')

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', plan?: SubscriptionPlan) => {
    setDialogMode(mode)
    if (plan) {
      setSelectedPlan(plan)
      setFormData(plan)
      setIconPreview(plan.icon || '')
    } else {
      setSelectedPlan(null)
      setFormData({
        name: '',
        description: '',
        icon: '📦',
        pricingModel: 'per-month',
        pricingTiers: [{ minStudents: 1, maxStudents: 50, pricePerStudent: 500 }],
        features: [''],
        maxStorage: 0,
        maxCourses: 0,
        isPopular: false,
        isActive: true,
        color: 'blue',
      })
      setIconPreview('')
      setIconFile(null)
    }
    setIsDialogOpen(true)
  }

  const handleSavePlan = () => {
    if (dialogMode === 'create') {
      const newPlan: SubscriptionPlan = {
        ...formData as SubscriptionPlan,
        id: formData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      }
      setPlans([...plans, newPlan])
    } else if (dialogMode === 'edit' && selectedPlan) {
      setPlans(plans.map(p => p.id === selectedPlan.id ? { ...formData as SubscriptionPlan, id: selectedPlan.id } : p))
    }
    setIsDialogOpen(false)
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== planId))
    }
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setIconPreview(result)
        setFormData({ ...formData, icon: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTier = () => {
    const lastTier = formData.pricingTiers?.[formData.pricingTiers.length - 1]
    const newTier: PricingTier = {
      minStudents: lastTier ? lastTier.maxStudents + 1 : 1,
      maxStudents: lastTier ? lastTier.maxStudents + 100 : 100,
      pricePerStudent: lastTier ? lastTier.pricePerStudent - 50 : 500,
    }
    setFormData({
      ...formData,
      pricingTiers: [...(formData.pricingTiers || []), newTier],
    })
  }

  const handleRemoveTier = (index: number) => {
    setFormData({
      ...formData,
      pricingTiers: formData.pricingTiers?.filter((_, i) => i !== index) || [],
    })
  }

  const handleTierChange = (index: number, field: keyof PricingTier, value: number) => {
    const newTiers = [...(formData.pricingTiers || [])]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData({
      ...formData,
      pricingTiers: newTiers,
    })
  }

  const calculatePrice = (plan: SubscriptionPlan, studentCount: number): number => {
    const tier = plan.pricingTiers.find(
      t => studentCount >= t.minStudents && studentCount <= t.maxStudents
    )
    return tier ? tier.pricePerStudent * studentCount : 0
  }
  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ''],
    })
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])]
    newFeatures[index] = value
    setFormData({
      ...formData,
      features: newFeatures,
    })
  }

  const totalMRR = plans.reduce((sum, plan) => {
    const subs = mockSubscriptions.filter(s => s.planId === plan.id && s.status === 'active')
    return sum + subs.reduce((subSum, sub) => {
      const tenant = mockTenants.find(t => t.id === sub.tenantId)
      const studentCount = tenant?.students || 100
      return subSum + calculatePrice(plan, studentCount)
    }, 0)
  }, 0)

  const columns = [
    {
      header: 'Tenant',
      accessor: 'tenantId' as const,
      cell: (value: string) => {
        const tenant = mockTenants.find((t) => t.id === value)
        return tenant?.name || 'Unknown'
      },
    },
    {
      header: 'Plan',
      accessor: 'planId' as const,
      cell: (value: string) => (
        <span className="capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          {value}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      cell: (value: number) => <span className="font-medium">${value.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
          past_due: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        }
        return (
          <span
            className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || ''}`}
          >
            {value.replace('_', ' ')}
          </span>
        )
      },
    },
    {
      header: 'Next Billing',
      accessor: 'currentPeriodEnd' as const,
      cell: (value: Date) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions & Billing"
        description="Manage subscription plans, pricing, and billing"
        titleAction={
          <Button onClick={() => handleOpenDialog('create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total MRR</p>
                <p className="text-xs text-muted-foreground">All active subscriptions</p>
              </div>
              <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
                <DollarSign className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xl font-bold">?{totalMRR.toLocaleString()}</p>
            <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">+12% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                <p className="text-xs text-muted-foreground">Currently available</p>
              </div>
              <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
                <Package className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold">{plans.filter(p => p.isActive).length}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">of {plans.length} total plans</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
                <p className="text-xs text-muted-foreground">Current active base</p>
              </div>
              <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/30">
                <Users className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xl font-bold">{mockSubscriptions.filter(s => s.status === 'active').length}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-xs text-muted-foreground">Subscription momentum</p>
              </div>
              <div className="rounded-full bg-orange-100 p-1.5 dark:bg-orange-900/30">
                <TrendingUp className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xl font-bold">+18%</p>
            <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">Trending up this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="plans">
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            Active Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const subscribers = mockSubscriptions.filter(s => s.planId === plan.id && s.status === 'active').length
              const revenue = mockSubscriptions
                .filter(s => s.planId === plan.id && s.status === 'active')
                .reduce((sum, sub) => {
                  const tenant = mockTenants.find(t => t.id === sub.tenantId)
                  const studentCount = tenant?.students || 100
                  return sum + calculatePrice(plan, studentCount)
                }, 0)
              
              const lowestTier = plan.pricingTiers[0]
              const highestTier = plan.pricingTiers[plan.pricingTiers.length - 1]
              
              return (
                <Card key={plan.id} className={`hover:shadow-lg transition-all relative overflow-hidden ${plan.isPopular ? 'border-2 border-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
                        {plan.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                        <CardDescription className="text-sm">{plan.description}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Per Student Pricing</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">₦{lowestTier.pricePerStudent}</span>
                        <span className="text-muted-foreground">- ₦{highestTier.pricePerStudent}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {plan.pricingModel === 'per-month' ? 'per student/month' : 'per student/session'}
                      </div>
                      <div className="mt-3 space-y-1">
                        {plan.pricingTiers.map((tier, idx) => (
                          <div key={idx} className="text-xs flex justify-between">
                            <span className="text-muted-foreground">
                              {tier.minStudents}-{tier.maxStudents === 999999 ? '∞' : tier.maxStudents} students:
                            </span>
                            <span className="font-semibold">₦{tier.pricePerStudent}/student</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Subscribers</span>
                        <span className="font-semibold">{subscribers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Revenue</span>
                        <span className="font-semibold">₦{revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog('view', plan)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog('edit', plan)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                    <p className="text-xs text-muted-foreground">Current recurring base</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
                    <Users className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-xl font-bold">{mockSubscriptions.filter((s) => s.status === 'active').length}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  ${mockSubscriptions
                    .filter((s) => s.status === 'active')
                    .reduce((sum, s) => sum + s.amount, 0)
                    .toLocaleString()} MRR
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Renewals</p>
                    <p className="text-xs text-muted-foreground">Expected soon</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
                    <TrendingUp className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xl font-bold">3</p>
                <p className="mt-1.5 text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900 p-3 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Past Due</p>
                    <p className="text-xs text-muted-foreground">Needs intervention</p>
                  </div>
                  <div className="rounded-full bg-red-100 p-1.5 dark:bg-red-900/30">
                    <X className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {mockSubscriptions.filter((s) => s.status === 'past_due').length}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">At risk</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border hover:shadow-md transition-shadow">
            <DataTable
              columns={columns}
              data={mockSubscriptions}
              pageSize={15}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit/View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {dialogMode === 'create' && 'Create New Subscription Plan'}
              {dialogMode === 'edit' && 'Edit Subscription Plan'}
              {dialogMode === 'view' && 'View Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' && 'Create a new subscription plan with custom pricing and features'}
              {dialogMode === 'edit' && 'Update the subscription plan details and pricing'}
              {dialogMode === 'view' && 'View subscription plan details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Illustration */}
            <div className="bg-muted/50 rounded-lg p-8 text-center border">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4 text-4xl">
                {iconPreview || formData.icon || '📦'}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {dialogMode === 'create' ? 'Design Your Perfect Plan' : formData.name}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {dialogMode === 'create' 
                  ? 'Configure per-student pricing with volume discounts to create the ideal subscription package'
                  : formData.description
                }
              </p>
            </div>

            {/* Icon Upload */}
            <div className="space-y-2">
              <Label htmlFor="icon">Plan Icon</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl">
                  {iconPreview || formData.icon || '📦'}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    id="icon"
                    placeholder="Enter emoji or upload image"
                    value={typeof formData.icon === 'string' && !formData.icon.startsWith('data:') ? formData.icon : ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    disabled={dialogMode === 'view'}
                  />
                  {dialogMode !== 'view' && (
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleIconUpload}
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIconPreview('')
                          setIconFile(null)
                          setFormData({ ...formData, icon: '📦' })
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Use an emoji or upload a custom icon image</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Professional"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={dialogMode === 'view'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing Model *</Label>
                <Select
                  value={formData.pricingModel}
                  onValueChange={(value: 'per-session' | 'per-month') => setFormData({ ...formData, pricingModel: value })}
                  disabled={dialogMode === 'view'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-month">Per Student Per Month</SelectItem>
                    <SelectItem value="per-session">Per Student Per Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what makes this plan special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={dialogMode === 'view'}
                rows={3}
              />
            </div>

            {/* Pricing Tiers */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg">Volume-Based Pricing Tiers</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set different prices based on student count. Higher volume = Lower price per student
                  </p>
                </div>
                {dialogMode !== 'view' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTier}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tier
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {formData.pricingTiers?.map((tier, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Min Students</Label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={tier.minStudents}
                            onChange={(e) => handleTierChange(index, 'minStudents', parseInt(e.target.value))}
                            disabled={dialogMode === 'view'}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Max Students</Label>
                          <Input
                            type="number"
                            placeholder="50"
                            value={tier.maxStudents === 999999 ? '' : tier.maxStudents}
                            onChange={(e) => handleTierChange(index, 'maxStudents', e.target.value ? parseInt(e.target.value) : 999999)}
                            disabled={dialogMode === 'view'}
                          />
                          <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price (₦) Per Student</Label>
                          <Input
                            type="number"
                            placeholder="500"
                            value={tier.pricePerStudent}
                            onChange={(e) => handleTierChange(index, 'pricePerStudent', parseInt(e.target.value))}
                            disabled={dialogMode === 'view'}
                          />
                        </div>
                      </div>
                      {dialogMode !== 'view' && formData.pricingTiers && formData.pricingTiers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveTier(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <span className="font-semibold">Example:</span> For {tier.minStudents === tier.maxStudents ? tier.minStudents : `${tier.minStudents}-${tier.maxStudents === 999999 ? '∞' : tier.maxStudents}`} students = 
                      <span className="font-semibold"> ₦{(tier.pricePerStudent * (tier.minStudents + 10)).toLocaleString()}</span>
                      {tier.minStudents !== tier.maxStudents && ` (${tier.minStudents + 10} students × ₦${tier.pricePerStudent})`}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Theme Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
                disabled={dialogMode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limits */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">Plan Limits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStorage">Max Storage (GB) Per Student</Label>
                  <Input
                    id="maxStorage"
                    type="number"
                    placeholder="-1 for unlimited"
                    value={formData.maxStorage}
                    onChange={(e) => setFormData({ ...formData, maxStorage: parseInt(e.target.value) })}
                    disabled={dialogMode === 'view'}
                  />
                  <p className="text-xs text-muted-foreground">-1 = Unlimited</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCourses">Max Courses</Label>
                  <Input
                    id="maxCourses"
                    type="number"
                    placeholder="-1 for unlimited"
                    value={formData.maxCourses}
                    onChange={(e) => setFormData({ ...formData, maxCourses: parseInt(e.target.value) })}
                    disabled={dialogMode === 'view'}
                  />
                  <p className="text-xs text-muted-foreground">-1 = Unlimited</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                {dialogMode !== 'view' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., 24/7 Support"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      disabled={dialogMode === 'view'}
                    />
                    {dialogMode !== 'view' && formData.features && formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mark as Popular</Label>
                  <p className="text-xs text-muted-foreground">Show a "Popular" badge on this plan</p>
                </div>
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  disabled={dialogMode === 'view'}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-xs text-muted-foreground">Make this plan available for subscription</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  disabled={dialogMode === 'view'}
                />
              </div>
            </div>
          </div>

          {dialogMode !== 'view' && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlan}>
                {dialogMode === 'create' ? 'Create Plan' : 'Save Changes'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
