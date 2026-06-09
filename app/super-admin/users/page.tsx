'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Shield,
  School,
  UserCog,
  UserCheck,
} from 'lucide-react'
import { format } from 'date-fns'
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
import { mockUsers, mockTenants } from '@/lib/mock-data'

const USERS_STORAGE_KEY = 'arefan-skills-hub:super-admin:users'

type AccessLevel = 'system_admin' | 'tenant_admin' | 'tenant_instructor' | 'tenant_student'
type UsersTab = 'all' | AccessLevel | 'suspended'
type UserStatus = 'active' | 'pending' | 'suspended'

type SuperAdminUser = {
  id: string
  fullName: string
  email: string
  phone: string
  jobTitle: string
  addressLine1: string
  city: string
  stateRegion: string
  country: string
  password?: string
  role: 'admin' | 'instructor' | 'student'
  accessLevel: AccessLevel
  tenantId?: string
  status: UserStatus
  createdAt: Date
  lastLogin?: Date
}

type UserFormData = {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  jobTitle: string
  addressLine1: string
  city: string
  stateRegion: string
  country: string
  accessLevel: Exclude<AccessLevel, 'tenant_student'>
  tenantId: string
  status: UserStatus
}

const DEFAULT_FORM: UserFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  jobTitle: '',
  addressLine1: '',
  city: '',
  stateRegion: '',
  country: '',
  accessLevel: 'system_admin',
  tenantId: '',
  status: 'active',
}

function parseDates(users: SuperAdminUser[]): SuperAdminUser[] {
  return users.map((user) => ({
    ...user,
    fullName: user.fullName || nameFromEmail(user.email),
    phone: user.phone || '',
    jobTitle: user.jobTitle || '',
    addressLine1: user.addressLine1 || '',
    city: user.city || '',
    stateRegion: user.stateRegion || '',
    country: user.country || '',
    password: user.password || '',
    createdAt: new Date(user.createdAt),
    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
  }))
}

function deriveAccessLevel(user: { role: string; tenantId?: string }): AccessLevel {
  if (user.role === 'admin' && !user.tenantId) return 'system_admin'
  if (user.role === 'admin' && user.tenantId) return 'tenant_admin'
  if (user.role === 'instructor') return 'tenant_instructor'
  return 'tenant_student'
}

function resolveRole(accessLevel: Exclude<AccessLevel, 'tenant_student'>): 'admin' | 'instructor' {
  if (accessLevel === 'tenant_instructor') return 'instructor'
  return 'admin'
}

function nameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || ''
  return localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export default function UsersPage() {
  const initialUsers = useMemo<SuperAdminUser[]>(
    () =>
      mockUsers.map((user) => ({
        ...user,
        fullName: nameFromEmail(user.email),
        phone: '',
        jobTitle: user.role === 'admin' ? 'Administrator' : user.role === 'instructor' ? 'Instructor' : 'Learner',
        addressLine1: '',
        city: '',
        stateRegion: '',
        country: '',
        password: '',
        accessLevel: deriveAccessLevel(user),
      })),
    [],
  )

  const [users, setUsers] = useState<SuperAdminUser[]>(initialUsers)
  const [activeTab, setActiveTab] = useState<UsersTab>('all')
  const [searchValue, setSearchValue] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserFormData>(DEFAULT_FORM)
  const [formError, setFormError] = useState('')

  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<SuperAdminUser | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as SuperAdminUser[]
      setUsers(parseDates(parsed))
    } catch {
      setUsers(initialUsers)
    }
  }, [initialUsers])

  useEffect(() => {
    if (!isMounted) return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }, [users, isMounted])

  const tenantNameMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const tenant of mockTenants) {
      map.set(tenant.id, tenant.name)
    }
    return map
  }, [])

  const counts = useMemo(
    () => ({
      system_admin: users.filter((u) => u.accessLevel === 'system_admin').length,
      tenant_admin: users.filter((u) => u.accessLevel === 'tenant_admin').length,
      tenant_instructor: users.filter((u) => u.accessLevel === 'tenant_instructor').length,
      tenant_student: users.filter((u) => u.accessLevel === 'tenant_student').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    }),
    [users],
  )

  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: users.length.toLocaleString(),
        hint: 'All accounts',
        icon: Users,
        tone: 'text-sky-700 bg-sky-100',
      },
      {
        title: 'System Admins',
        value: counts.system_admin.toLocaleString(),
        hint: 'Global platform access',
        icon: Shield,
        tone: 'text-violet-700 bg-violet-100',
      },
      {
        title: 'Tenant Admins',
        value: counts.tenant_admin.toLocaleString(),
        hint: 'School-level admins',
        icon: School,
        tone: 'text-emerald-700 bg-emerald-100',
      },
      {
        title: 'Instructors',
        value: counts.tenant_instructor.toLocaleString(),
        hint: 'Tenant teaching staff',
        icon: UserCog,
        tone: 'text-amber-700 bg-amber-100',
      },
      {
        title: 'Suspended',
        value: counts.suspended.toLocaleString(),
        hint: 'Restricted accounts',
        icon: UserCheck,
        tone: 'text-rose-700 bg-rose-100',
      },
    ],
    [counts, users.length],
  )

  const tabbedUsers: Record<UsersTab, SuperAdminUser[]> = useMemo(
    () => ({
      all: users,
      system_admin: users.filter((u) => u.accessLevel === 'system_admin'),
      tenant_admin: users.filter((u) => u.accessLevel === 'tenant_admin'),
      tenant_instructor: users.filter((u) => u.accessLevel === 'tenant_instructor'),
      tenant_student: users.filter((u) => u.accessLevel === 'tenant_student'),
      suspended: users.filter((u) => u.status === 'suspended'),
    }),
    [users],
  )

  const filteredUsers = useMemo(() => {
    const list = tabbedUsers[activeTab]
    const query = searchValue.trim().toLowerCase()
    if (!query) return list

    return list.filter((user) => {
      const tenantName = user.tenantId ? tenantNameMap.get(user.tenantId) || '' : ''
      return (
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.jobTitle.toLowerCase().includes(query) ||
        user.accessLevel.toLowerCase().includes(query) ||
        tenantName.toLowerCase().includes(query)
      )
    })
  }, [activeTab, searchValue, tabbedUsers, tenantNameMap])

  const resetForm = () => {
    setFormData(DEFAULT_FORM)
    setFormError('')
    setEditingUserId(null)
  }

  const openCreateDialog = () => {
    setFormMode('create')
    resetForm()
    setIsFormOpen(true)
  }

  const handleView = (userId: string) => {
    const user = users.find((item) => item.id === userId)
    if (!user) return
    setSelectedUser(user)
  }

  const handleEdit = (userId: string) => {
    const user = users.find((item) => item.id === userId)
    if (!user || user.accessLevel === 'tenant_student') return

    setFormMode('edit')
    setEditingUserId(user.id)
    setFormData({
      fullName: user.fullName || '',
      email: user.email,
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
      jobTitle: user.jobTitle || '',
      addressLine1: user.addressLine1 || '',
      city: user.city || '',
      stateRegion: user.stateRegion || '',
      country: user.country || '',
      accessLevel: user.accessLevel,
      tenantId: user.tenantId ?? '',
      status: user.status,
    })
    setFormError('')
    setIsFormOpen(true)
  }

  const handleDeleteRequest = (userId: string) => {
    const user = users.find((item) => item.id === userId)
    if (!user) return
    setUserToDelete(user)
  }

  const handleConfirmDelete = () => {
    if (!userToDelete) return
    setUsers((current) => current.filter((user) => user.id !== userToDelete.id))
    setUserToDelete(null)
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required.'
    if (!formData.email.trim()) return 'Email is required.'
    if (!formData.email.includes('@')) return 'Enter a valid email.'
    if (!formData.phone.trim()) return 'Phone is required.'
    if (!formData.addressLine1.trim()) return 'Address is required.'
    if (!formData.city.trim()) return 'City is required.'
    if (!formData.country.trim()) return 'Country is required.'
    if (formMode === 'create' && !formData.password) return 'Password is required.'
    if (formData.password && formData.password.length < 8) return 'Password must be at least 8 characters.'
    if (formData.password !== formData.confirmPassword) return 'Password and confirm password must match.'
    if (formData.accessLevel !== 'system_admin' && !formData.tenantId) {
      return 'Tenant is required for tenant-level roles.'
    }
    return ''
  }

  const handleSaveUser = () => {
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    const base = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      jobTitle: formData.jobTitle.trim(),
      addressLine1: formData.addressLine1.trim(),
      city: formData.city.trim(),
      stateRegion: formData.stateRegion.trim(),
      country: formData.country.trim(),
      password: formData.password || undefined,
      accessLevel: formData.accessLevel,
      role: resolveRole(formData.accessLevel),
      tenantId: formData.accessLevel === 'system_admin' ? undefined : formData.tenantId,
      status: formData.status,
    }

    if (formMode === 'create') {
      const newUser: SuperAdminUser = {
        id: `user_${Date.now()}`,
        ...base,
        createdAt: new Date(),
        lastLogin: undefined,
      }
      setUsers((current) => [newUser, ...current])
    } else if (editingUserId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                ...base,
                password: base.password ?? user.password,
              }
            : user,
        ),
      )
    }

    setIsFormOpen(false)
    resetForm()
  }

  const columns = [
    {
      header: 'Name',
      accessor: 'fullName' as const,
      cell: (value: string, row: SuperAdminUser) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Access Level',
      accessor: 'accessLevel' as const,
      cell: (value: AccessLevel) => {
        const labelMap: Record<AccessLevel, string> = {
          system_admin: 'System Admin',
          tenant_admin: 'Tenant Admin',
          tenant_instructor: 'Tenant Instructor',
          tenant_student: 'Tenant Student',
        }
        const colorMap: Record<AccessLevel, string> = {
          system_admin: 'bg-violet-100 text-violet-700',
          tenant_admin: 'bg-emerald-100 text-emerald-700',
          tenant_instructor: 'bg-amber-100 text-amber-700',
          tenant_student: 'bg-sky-100 text-sky-700',
        }
        return (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[value]}`}>
            {labelMap[value]}
          </span>
        )
      },
    },
    {
      header: 'Tenant',
      accessor: 'tenantId' as const,
      cell: (value: string | undefined) => (
        <span className="text-sm text-muted-foreground">{value ? tenantNameMap.get(value) || '-' : 'Global'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: UserStatus) => {
        const statusColors: Record<UserStatus, string> = {
          active: 'bg-green-100 text-green-700',
          pending: 'bg-yellow-100 text-yellow-800',
          suspended: 'bg-red-100 text-red-700',
        }
        return (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[value]}`}>
            {value}
          </span>
        )
      },
    },
    {
      header: 'Created',
      accessor: 'createdAt' as const,
      cell: (value: Date) => <span className="text-sm text-muted-foreground">{format(new Date(value), 'MMM dd, yyyy')}</span>,
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (value: string) => {
        const user = users.find((item) => item.id === value)
        const canEdit = user?.accessLevel !== 'tenant_student'

        return (
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
                View Profile
              </DropdownMenuItem>
              {canEdit ? (
                <DropdownMenuItem onClick={() => handleEdit(value)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteRequest(value)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Create and manage system-level and tenant-level users"
        titleAction={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className={`p-3 shadow-sm hover:shadow-md transition-shadow ${
            stat.title === 'Total Users'
              ? 'border-sky-200 dark:border-sky-900'
              : stat.title === 'System Admins'
                ? 'border-violet-200 dark:border-violet-900'
                : stat.title === 'Tenant Admins'
                  ? 'border-emerald-200 dark:border-emerald-900'
                  : stat.title === 'Instructors'
                    ? 'border-amber-200 dark:border-amber-900'
                    : 'border-rose-200 dark:border-rose-900'
          }`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div className={`rounded-full p-1.5 ${stat.tone}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="mt-2 text-xl font-bold leading-none">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="border p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by name, email, role, or tenant"
            className="sm:max-w-md"
          />
          <p className="text-sm text-muted-foreground">{filteredUsers.length} user(s) found</p>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UsersTab)} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({users.length})</TabsTrigger>
          <TabsTrigger value="system_admin">System Admin ({counts.system_admin})</TabsTrigger>
          <TabsTrigger value="tenant_admin">Tenant Admin ({counts.tenant_admin})</TabsTrigger>
          <TabsTrigger value="tenant_instructor">Instructor ({counts.tenant_instructor})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({counts.suspended})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card className="hover:shadow-md transition-shadow">
            <DataTable
              columns={columns}
              data={filteredUsers}
              pageSize={15}
              emptyMessage={`No ${activeTab.replace('_', ' ')} users found`}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
          <DialogHeader>
            <div className="border-b px-6 pt-6 pb-4">
              <DialogTitle className="text-xl">
                {formMode === 'create' ? 'Create User Account' : 'Edit User Account'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Add complete profile, credentials, and tenant assignment for super admin operations.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, fullName: event.target.value }))
                    }
                    placeholder="Amanda Carter"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="amanda@school.edu"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-phone">Phone</Label>
                  <Input
                    id="user-phone"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="+1 555 010 1212"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-title">Job Title</Label>
                  <Input
                    id="user-title"
                    value={formData.jobTitle}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, jobTitle: event.target.value }))
                    }
                    placeholder="Platform Operations Manager"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="user-address">Address</Label>
                <Textarea
                  id="user-address"
                  value={formData.addressLine1}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, addressLine1: event.target.value }))
                  }
                  placeholder="101 Learning Avenue"
                  className="min-h-20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="user-city">City</Label>
                  <Input
                    id="user-city"
                    value={formData.city}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, city: event.target.value }))
                    }
                    placeholder="Chicago"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-state">State / Region</Label>
                  <Input
                    id="user-state"
                    value={formData.stateRegion}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, stateRegion: event.target.value }))
                    }
                    placeholder="Illinois"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-country">Country</Label>
                  <Input
                    id="user-country"
                    value={formData.country}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, country: event.target.value }))
                    }
                    placeholder="USA"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-password">{formMode === 'create' ? 'Password' : 'New Password (optional)'}</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-confirm-password">Confirm Password</Label>
                  <Input
                    id="user-confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Role Scope</Label>
                  <Select
                    value={formData.accessLevel}
                    onValueChange={(value: UserFormData['accessLevel']) =>
                      setFormData((current) => ({
                        ...current,
                        accessLevel: value,
                        tenantId: value === 'system_admin' ? '' : current.tenantId,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_admin">System Admin</SelectItem>
                      <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                      <SelectItem value="tenant_instructor">Tenant Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: UserStatus) =>
                      setFormData((current) => ({ ...current, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.accessLevel !== 'system_admin' ? (
                <div className="grid gap-2">
                  <Label>Tenant</Label>
                  <Select
                    value={formData.tenantId || undefined}
                    onValueChange={(value) =>
                      setFormData((current) => ({
                        ...current,
                        tenantId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                  This user will have platform-wide access and will not be tied to a tenant.
                </div>
              )}

              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            </div>

            <div className="relative overflow-hidden border-l bg-muted/20 px-5 py-6">
              <UserCog
                className="pointer-events-none absolute top-0 right-0 h-56 w-56 translate-x-1/4 -translate-y-1/4 text-sky-100/45"
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-4">
                <h3 className="text-lg font-semibold leading-tight">
                  Provision secure users with complete operational profile.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill all profile fields to keep user records ready for audit, communication, and tenant operations.
                </p>
                <div className="rounded-md border bg-background p-3">
                  <p className="text-xs font-medium text-muted-foreground">Checklist</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li>Identity and contact details</li>
                    <li>Password and access security</li>
                    <li>Role scope and tenant assignment</li>
                    <li>Address and location profile</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>{formMode === 'create' ? 'Create User' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Account details and platform access.</DialogDescription>
          </DialogHeader>

          {selectedUser ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{selectedUser.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{selectedUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{selectedUser.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Job Title</span>
                <span className="font-medium">{selectedUser.jobTitle || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Access Level</span>
                <span className="font-medium capitalize">{selectedUser.accessLevel.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tenant</span>
                <span className="font-medium">
                  {selectedUser.tenantId ? tenantNameMap.get(selectedUser.tenantId) || '-' : 'Global'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{selectedUser.status}</span>
              </div>
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="mt-1">
                  {[selectedUser.addressLine1, selectedUser.city, selectedUser.stateRegion, selectedUser.country]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{format(new Date(selectedUser.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">
                  {selectedUser.lastLogin ? format(new Date(selectedUser.lastLogin), 'MMM dd, yyyy') : 'Never'}
                </span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete
                ? `This will permanently remove ${userToDelete.email}. This action cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
