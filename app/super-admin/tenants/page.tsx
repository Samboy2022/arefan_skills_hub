'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  School,
  Palette,
  Building2,
  Sparkles,
  UploadCloud,
  Users,
  BookOpen,
  Activity,
  Clock3,
} from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockTenants } from '@/lib/mock-data'
import { Tenant } from '@/lib/types'
import { format } from 'date-fns'

const TENANTS_STORAGE_KEY = 'fnskills:super-admin:tenants'
const TENANT_DETAILS_STORAGE_KEY = 'fnskills:super-admin:tenant-details'

type TenantTab = 'all' | 'active' | 'trial' | 'suspended' | 'pending'
type TenantWizardStep = 0 | 1 | 2 | 3
type TenantFormData = {
  name: string
  domain: string
  plan: Tenant['plan']
  status: Tenant['status']
  students: number
  courses: number
}
type TenantDetails = {
  about: string
  motto: string
  address: string
  city: string
  region: string
  country: string
  phone: string
  contactEmail: string
  website: string
  principalName: string
  foundedYear: string
  language: string
  timezone: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string
}

const DEFAULT_FORM: TenantFormData = {
  name: '',
  domain: '',
  plan: 'starter',
  status: 'pending',
  students: 0,
  courses: 0,
}
const DEFAULT_DETAILS: TenantDetails = {
  about: '',
  motto: '',
  address: '',
  city: '',
  region: '',
  country: '',
  phone: '',
  contactEmail: '',
  website: '',
  principalName: '',
  foundedYear: '',
  language: 'English',
  timezone: 'UTC',
  primaryColor: '#0f766e',
  secondaryColor: '#f59e0b',
  logoUrl: '',
}
const WIZARD_STEPS: Array<{ title: string; subtitle: string }> = [
  { title: 'School Profile', subtitle: 'Identity and overview' },
  { title: 'Branding', subtitle: 'Logo and visual colors' },
  { title: 'Operations', subtitle: 'Contact and administration' },
  { title: 'Review', subtitle: 'Confirm details' },
]

function parseTenantDates(tenants: Tenant[]): Tenant[] {
  return tenants.map((tenant) => ({
    ...tenant,
    createdAt: new Date(tenant.createdAt),
    lastLogin: tenant.lastLogin ? new Date(tenant.lastLogin) : undefined,
  }))
}

export default function TenantsPage() {
  const [activeTab, setActiveTab] = useState<TenantTab>('all')
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [isMounted, setIsMounted] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [wizardStep, setWizardStep] = useState<TenantWizardStep>(0)
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TenantFormData>(DEFAULT_FORM)
  const [detailsData, setDetailsData] = useState<TenantDetails>(DEFAULT_DETAILS)
  const [tenantDetailsMap, setTenantDetailsMap] = useState<Record<string, TenantDetails>>({})
  const [formError, setFormError] = useState<string>('')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Tenant[]
      setTenants(parseTenantDates(parsed))
    } catch {
      setTenants(mockTenants)
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants))
  }, [tenants, isMounted])

  useEffect(() => {
    const raw = localStorage.getItem(TENANT_DETAILS_STORAGE_KEY)
    if (!raw) return
    try {
      setTenantDetailsMap(JSON.parse(raw) as Record<string, TenantDetails>)
    } catch {
      setTenantDetailsMap({})
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    localStorage.setItem(TENANT_DETAILS_STORAGE_KEY, JSON.stringify(tenantDetailsMap))
  }, [tenantDetailsMap, isMounted])

  const statusCounts = useMemo(
    () => ({
      active: tenants.filter((t) => t.status === 'active').length,
      trial: tenants.filter((t) => t.status === 'trial').length,
      suspended: tenants.filter((t) => t.status === 'suspended').length,
      pending: tenants.filter((t) => t.status === 'pending').length,
    }),
    [tenants],
  )

  const filteredTenants: Record<TenantTab, Tenant[]> = useMemo(
    () => ({
      all: tenants,
      active: tenants.filter((t) => t.status === 'active'),
      trial: tenants.filter((t) => t.status === 'trial'),
      suspended: tenants.filter((t) => t.status === 'suspended'),
      pending: tenants.filter((t) => t.status === 'pending'),
    }),
    [tenants],
  )

  const tenantStats = useMemo(() => {
    const totalStudents = tenants.reduce((sum, tenant) => sum + tenant.students, 0)
    const totalCourses = tenants.reduce((sum, tenant) => sum + tenant.courses, 0)
    return [
      {
        title: 'Total Tenants',
        value: tenants.length.toLocaleString(),
        hint: 'All schools and institutions',
        icon: School,
        tone: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        borderTone: 'border-sky-200 dark:border-sky-900',
      },
      {
        title: 'Active Tenants',
        value: statusCounts.active.toLocaleString(),
        hint: 'Currently operating',
        icon: Activity,
        tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        borderTone: 'border-emerald-200 dark:border-emerald-900',
      },
      {
        title: 'Total Students',
        value: totalStudents.toLocaleString(),
        hint: 'Across all tenants',
        icon: Users,
        tone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        borderTone: 'border-indigo-200 dark:border-indigo-900',
      },
      {
        title: 'Total Courses',
        value: totalCourses.toLocaleString(),
        hint: 'Published and draft',
        icon: BookOpen,
        tone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        borderTone: 'border-amber-200 dark:border-amber-900',
      },
      {
        title: 'Pending + Trial',
        value: (statusCounts.pending + statusCounts.trial).toLocaleString(),
        hint: 'Need onboarding attention',
        icon: Clock3,
        tone: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        borderTone: 'border-orange-200 dark:border-orange-900',
      },
    ]
  }, [tenants, statusCounts.active, statusCounts.pending, statusCounts.trial])

  const openCreateDialog = () => {
    setFormMode('create')
    setEditingTenantId(null)
    setFormData(DEFAULT_FORM)
    setDetailsData(DEFAULT_DETAILS)
    setWizardStep(0)
    setFormError('')
    setIsFormDialogOpen(true)
  }

  const handleView = (tenantId: string) => {
    const tenant = tenants.find((item) => item.id === tenantId)
    if (!tenant) return
    setSelectedTenant(tenant)
  }

  const handleEdit = (tenantId: string) => {
    const tenant = tenants.find((item) => item.id === tenantId)
    if (!tenant) return
    setFormMode('edit')
    setEditingTenantId(tenant.id)
    setFormData({
      name: tenant.name,
      domain: tenant.domain,
      plan: tenant.plan,
      status: tenant.status,
      students: tenant.students,
      courses: tenant.courses,
    })
    setDetailsData(tenantDetailsMap[tenant.id] ?? DEFAULT_DETAILS)
    setWizardStep(0)
    setFormError('')
    setIsFormDialogOpen(true)
  }

  const handleDeleteRequest = (tenantId: string) => {
    const tenant = tenants.find((item) => item.id === tenantId)
    if (!tenant) return
    setTenantToDelete(tenant)
  }

  const confirmDelete = () => {
    if (!tenantToDelete) return
    setTenantDetailsMap((current) => {
      const updated = { ...current }
      delete updated[tenantToDelete.id]
      return updated
    })
    setTenants((current) => current.filter((tenant) => tenant.id !== tenantToDelete.id))
    setTenantToDelete(null)
  }

  const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value)

  const validateStep = (step: TenantWizardStep) => {
    if (step === 0) {
      if (!formData.name.trim()) return 'Tenant name is required.'
      if (!formData.domain.trim()) return 'Domain is required.'
      if (!detailsData.about.trim()) return 'School description is required.'
      return ''
    }

    if (step === 1) {
      if (!isValidHexColor(detailsData.primaryColor)) return 'Primary color must be a valid hex color.'
      if (!isValidHexColor(detailsData.secondaryColor))
        return 'Secondary color must be a valid hex color.'
      return ''
    }

    if (step === 2) {
      if (!detailsData.contactEmail.trim()) return 'Contact email is required.'
      if (!detailsData.phone.trim()) return 'Contact phone is required.'
      return ''
    }

    return ''
  }

  const validateForm = () => {
    const step0Error = validateStep(0)
    if (step0Error) return step0Error
    const step1Error = validateStep(1)
    if (step1Error) return step1Error
    const step2Error = validateStep(2)
    if (step2Error) return step2Error
    if (!formData.name.trim()) return 'Tenant name is required.'
    if (!formData.domain.trim()) return 'Domain is required.'
    if (formData.students < 0) return 'Students count must be 0 or greater.'
    if (formData.courses < 0) return 'Courses count must be 0 or greater.'
    return ''
  }

  const handleNextStep = () => {
    const validationError = validateStep(wizardStep)
    if (validationError) {
      setFormError(validationError)
      return
    }
    setFormError('')
    setWizardStep((current) => Math.min(3, current + 1) as TenantWizardStep)
  }

  const handlePrevStep = () => {
    setFormError('')
    setWizardStep((current) => Math.max(0, current - 1) as TenantWizardStep)
  }

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setDetailsData((current) => ({ ...current, logoUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveTenant = () => {
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    if (formMode === 'create') {
      const newTenantId = String(Date.now())
      const newTenant: Tenant = {
        id: newTenantId,
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        plan: formData.plan,
        status: formData.status,
        students: formData.students,
        courses: formData.courses,
        createdAt: new Date(),
        lastLogin: undefined,
      }
      setTenants((current) => [newTenant, ...current])
      setTenantDetailsMap((current) => ({ ...current, [newTenantId]: detailsData }))
    } else if (editingTenantId) {
      setTenants((current) =>
        current.map((tenant) =>
          tenant.id === editingTenantId
            ? {
                ...tenant,
                name: formData.name.trim(),
                domain: formData.domain.trim(),
                plan: formData.plan,
                status: formData.status,
                students: formData.students,
                courses: formData.courses,
              }
            : tenant,
        ),
      )
      setTenantDetailsMap((current) => ({ ...current, [editingTenantId]: detailsData }))
    }

    setIsFormDialogOpen(false)
    setWizardStep(0)
    setFormError('')
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
    },
    {
      header: 'Domain',
      accessor: 'domain' as const,
    },
    {
      header: 'Plan',
      accessor: 'plan' as const,
      cell: (value: string) => (
        <span className="capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const colors: Record<string, string> = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
          suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        }
        return (
          <span
            className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[value] || ''}`}
          >
            {value}
          </span>
        )
      },
    },
    {
      header: 'Students',
      accessor: 'students' as const,
      cell: (value: number) => <span className="font-medium">{value.toLocaleString()}</span>,
    },
    {
      header: 'Courses',
      accessor: 'courses' as const,
      cell: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      header: 'Created',
      accessor: 'createdAt' as const,
      cell: (value: Date) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (value: string) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleView(value)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(value)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tenant
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteRequest(value)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenants"
        description="Manage all schools and institutions on the platform"
        titleAction={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Tenant
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {tenantStats.map((stat) => (
          <Card key={stat.title} className={`${stat.borderTone} p-3 hover:shadow-md transition-shadow`}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div className={`rounded-full p-1.5 ${stat.tone}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-xl font-bold leading-none">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TenantTab)}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({tenants.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({statusCounts.active})
          </TabsTrigger>
          <TabsTrigger value="trial">
            Trial ({statusCounts.trial})
          </TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended ({statusCounts.suspended})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card className="hover:shadow-md transition-shadow">
            <DataTable
              columns={columns}
              data={filteredTenants[activeTab as keyof typeof filteredTenants]}
              pageSize={15}
              emptyMessage={`No ${activeTab} tenants found`}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
          <DialogHeader>
            <div className="border-b px-6 pt-6 pb-4">
              <DialogTitle className="text-xl">
                {formMode === 'create' ? 'Create Tenant Workspace' : 'Edit Tenant Workspace'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {formMode === 'create'
                  ? 'Set up the full school profile, branding, and operational details.'
                  : 'Refine school information, branding, and settings for this tenant.'}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 px-6 py-5">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {WIZARD_STEPS.map((step, index) => {
                    const isActive = wizardStep === index
                    const isDone = wizardStep > index
                    return (
                      <button
                        key={step.title}
                        type="button"
                        onClick={() => setWizardStep(index as TenantWizardStep)}
                        className={`rounded-lg border p-2 text-left transition-colors ${
                          isActive
                            ? 'border-primary bg-primary/5'
                            : isDone
                              ? 'border-emerald-300 bg-emerald-50'
                              : 'border-border bg-background'
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {index + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{step.subtitle}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {wizardStep === 0 ? (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tenant-name">School Name</Label>
                    <Input
                      id="tenant-name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Lincoln High School"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tenant-domain">Tenant Domain</Label>
                    <Input
                      id="tenant-domain"
                      value={formData.domain}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, domain: event.target.value }))
                      }
                      placeholder="lincoln.edu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="school-about">Description / About School</Label>
                    <Textarea
                      id="school-about"
                      value={detailsData.about}
                      onChange={(event) =>
                        setDetailsData((current) => ({ ...current, about: event.target.value }))
                      }
                      placeholder="A short profile of the institution, values, and learning approach."
                      className="min-h-28"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="school-motto">Motto (optional)</Label>
                    <Input
                      id="school-motto"
                      value={detailsData.motto}
                      onChange={(event) =>
                        setDetailsData((current) => ({ ...current, motto: event.target.value }))
                      }
                      placeholder="Learning for life"
                    />
                  </div>
                </div>
              ) : null}

              {wizardStep === 1 ? (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="school-logo-url">School Logo URL</Label>
                    <Input
                      id="school-logo-url"
                      value={detailsData.logoUrl}
                      onChange={(event) =>
                        setDetailsData((current) => ({ ...current, logoUrl: event.target.value }))
                      }
                      placeholder="https://school.com/logo.png"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="school-logo-upload">Or Upload Logo</Label>
                    <Input
                      id="school-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="school-primary-color">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="school-primary-color"
                          type="color"
                          value={detailsData.primaryColor}
                          onChange={(event) =>
                            setDetailsData((current) => ({
                              ...current,
                              primaryColor: event.target.value,
                            }))
                          }
                          className="h-10 w-14 p-1"
                        />
                        <Input
                          value={detailsData.primaryColor}
                          onChange={(event) =>
                            setDetailsData((current) => ({
                              ...current,
                              primaryColor: event.target.value,
                            }))
                          }
                          placeholder="#0f766e"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-secondary-color">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="school-secondary-color"
                          type="color"
                          value={detailsData.secondaryColor}
                          onChange={(event) =>
                            setDetailsData((current) => ({
                              ...current,
                              secondaryColor: event.target.value,
                            }))
                          }
                          className="h-10 w-14 p-1"
                        />
                        <Input
                          value={detailsData.secondaryColor}
                          onChange={(event) =>
                            setDetailsData((current) => ({
                              ...current,
                              secondaryColor: event.target.value,
                            }))
                          }
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {wizardStep === 2 ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tenant-plan">Plan</Label>
                      <Select
                        value={formData.plan}
                        onValueChange={(value: Tenant['plan']) =>
                          setFormData((current) => ({ ...current, plan: value }))
                        }
                      >
                        <SelectTrigger id="tenant-plan">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant-status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: Tenant['status']) =>
                          setFormData((current) => ({ ...current, status: value }))
                        }
                      >
                        <SelectTrigger id="tenant-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tenant-students">Students</Label>
                      <Input
                        id="tenant-students"
                        type="number"
                        min={0}
                        value={formData.students}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            students: Number(event.target.value || 0),
                          }))
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tenant-courses">Courses</Label>
                      <Input
                        id="tenant-courses"
                        type="number"
                        min={0}
                        value={formData.courses}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            courses: Number(event.target.value || 0),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="school-contact-email">Contact Email</Label>
                      <Input
                        id="school-contact-email"
                        type="email"
                        value={detailsData.contactEmail}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            contactEmail: event.target.value,
                          }))
                        }
                        placeholder="admin@lincoln.edu"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-phone">Phone</Label>
                      <Input
                        id="school-phone"
                        value={detailsData.phone}
                        onChange={(event) =>
                          setDetailsData((current) => ({ ...current, phone: event.target.value }))
                        }
                        placeholder="+1 555 120 4588"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="school-principal">Principal Name</Label>
                      <Input
                        id="school-principal"
                        value={detailsData.principalName}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            principalName: event.target.value,
                          }))
                        }
                        placeholder="Dr. Amanda Liu"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-founded">Founded Year</Label>
                      <Input
                        id="school-founded"
                        value={detailsData.foundedYear}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            foundedYear: event.target.value,
                          }))
                        }
                        placeholder="1998"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="school-website">Website</Label>
                      <Input
                        id="school-website"
                        value={detailsData.website}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            website: event.target.value,
                          }))
                        }
                        placeholder="https://lincoln.edu"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-language">Primary Language</Label>
                      <Input
                        id="school-language"
                        value={detailsData.language}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            language: event.target.value,
                          }))
                        }
                        placeholder="English"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="school-timezone">Timezone</Label>
                      <Input
                        id="school-timezone"
                        value={detailsData.timezone}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            timezone: event.target.value,
                          }))
                        }
                        placeholder="UTC-05:00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-address">Address</Label>
                      <Input
                        id="school-address"
                        value={detailsData.address}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            address: event.target.value,
                          }))
                        }
                        placeholder="101 Learning Avenue"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="school-city">City</Label>
                      <Input
                        id="school-city"
                        value={detailsData.city}
                        onChange={(event) =>
                          setDetailsData((current) => ({ ...current, city: event.target.value }))
                        }
                        placeholder="Springfield"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-region">State / Region</Label>
                      <Input
                        id="school-region"
                        value={detailsData.region}
                        onChange={(event) =>
                          setDetailsData((current) => ({ ...current, region: event.target.value }))
                        }
                        placeholder="Illinois"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school-country">Country</Label>
                      <Input
                        id="school-country"
                        value={detailsData.country}
                        onChange={(event) =>
                          setDetailsData((current) => ({
                            ...current,
                            country: event.target.value,
                          }))
                        }
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {wizardStep === 3 ? (
                <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    {detailsData.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={detailsData.logoUrl}
                        alt={`${formData.name} logo`}
                        className="h-12 w-12 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-background">
                        <School className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-base font-semibold">{formData.name || 'School Name'}</p>
                      <p className="text-sm text-muted-foreground">{formData.domain || 'domain.com'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-md border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Brand Colors</p>
                      <div className="mt-2 flex gap-2">
                        <div
                          className="h-8 w-8 rounded-md border"
                          style={{ backgroundColor: detailsData.primaryColor }}
                        />
                        <div
                          className="h-8 w-8 rounded-md border"
                          style={{ backgroundColor: detailsData.secondaryColor }}
                        />
                      </div>
                    </div>
                    <div className="rounded-md border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Plan / Status</p>
                      <p className="mt-2 text-sm font-medium capitalize">
                        {formData.plan} / {formData.status}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">About</p>
                    <p className="mt-2 text-sm">{detailsData.about || 'No school description yet.'}</p>
                  </div>
                </div>
              ) : null}

              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            </div>

            <div className="relative border-l bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50 px-5 py-6">
              <div className="absolute -left-4 top-8 h-8 w-8 rounded-full bg-primary/20 blur-md" />
              <School
                className="pointer-events-none absolute top-0 right-0 h-56 w-56 translate-x-1/4 -translate-y-1/4 text-sky-100/45"
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Setup assistant
                </div>

                <h3 className="text-lg font-semibold leading-tight">
                  Build a complete school profile with better data quality.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use the wizard to capture identity, branding, and admin details in one flow so every tenant starts with consistent data.
                </p>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 rounded-md border bg-white/80 p-2">
                    <School className="h-4 w-4 text-primary" />
                    <span className="text-xs">School profile and story</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border bg-white/80 p-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span className="text-xs">Logo and color system</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border bg-white/80 p-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-xs">Operations and contacts</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border bg-white/80 p-2">
                    <UploadCloud className="h-4 w-4 text-primary" />
                    <span className="text-xs">Asset-ready tenant setup</span>
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-3 shadow-sm">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${((wizardStep + 1) / WIZARD_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Cancel
            </Button>
            {wizardStep > 0 ? (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : null}
            {wizardStep < 3 ? (
              <Button onClick={handleNextStep}>Continue</Button>
            ) : (
              <Button onClick={handleSaveTenant}>
                {formMode === 'create' ? 'Create Tenant' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedTenant)} onOpenChange={(open) => !open && setSelectedTenant(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>School Profile</DialogTitle>
            <DialogDescription>Full tenant information, branding, and operations data.</DialogDescription>
          </DialogHeader>

          {selectedTenant ? (
            (() => {
              const details = tenantDetailsMap[selectedTenant.id]
              return (
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {details?.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={details.logoUrl}
                            alt={`${selectedTenant.name} logo`}
                            className="h-16 w-16 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-background">
                            <School className="h-7 w-7 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-semibold leading-tight">{selectedTenant.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedTenant.domain}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                          {selectedTenant.plan}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                          {selectedTenant.status}
                        </span>
                      </div>
                    </div>
                    {details?.about ? (
                      <div className="mt-4 rounded-md border bg-background p-3">
                        <p className="text-xs text-muted-foreground">About School</p>
                        <p className="mt-1 leading-relaxed">{details.about}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Academics And Platform
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-medium">{selectedTenant.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Courses</span>
                          <span className="font-medium">{selectedTenant.courses}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span className="font-medium">
                            {format(new Date(selectedTenant.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last Login</span>
                          <span className="font-medium">
                            {selectedTenant.lastLogin
                              ? format(new Date(selectedTenant.lastLogin), 'MMM dd, yyyy')
                              : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Contact And Leadership
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Contact Email</span>
                          <span className="text-right font-medium">{details?.contactEmail || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="text-right font-medium">{details?.phone || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Website</span>
                          <span className="text-right font-medium">{details?.website || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Principal</span>
                          <span className="text-right font-medium">{details?.principalName || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Founded</span>
                          <span className="text-right font-medium">{details?.foundedYear || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location And Locale
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Address</span>
                          <span className="text-right font-medium">{details?.address || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">City</span>
                          <span className="text-right font-medium">{details?.city || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">State/Region</span>
                          <span className="text-right font-medium">{details?.region || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Country</span>
                          <span className="text-right font-medium">{details?.country || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Language</span>
                          <span className="text-right font-medium">{details?.language || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Timezone</span>
                          <span className="text-right font-medium">{details?.timezone || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Branding
                      </p>
                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-md border bg-muted/20 p-2">
                            <p className="text-[11px] text-muted-foreground">Primary Color</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="h-5 w-5 rounded border"
                                style={{ backgroundColor: details?.primaryColor || '#0f766e' }}
                              />
                              <span className="font-medium">{details?.primaryColor || '-'}</span>
                            </div>
                          </div>
                          <div className="rounded-md border bg-muted/20 p-2">
                            <p className="text-[11px] text-muted-foreground">Secondary Color</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="h-5 w-5 rounded border"
                                style={{ backgroundColor: details?.secondaryColor || '#f59e0b' }}
                              />
                              <span className="font-medium">{details?.secondaryColor || '-'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-2">
                          <p className="text-[11px] text-muted-foreground">Motto</p>
                          <p className="mt-1 font-medium">{details?.motto || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(tenantToDelete)} onOpenChange={(open) => !open && setTenantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              {tenantToDelete
                ? `This will permanently remove ${tenantToDelete.name} from the list. This action cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
