'use client'

import { useState } from 'react'
import { Plus, Shield, Users, Edit, Trash2, Copy, MoreVertical, Search } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const roles = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full platform access and management',
    permissions: ['all'],
    userCount: 3,
    color: 'red',
    isSystem: true,
  },
  {
    id: '2',
    name: 'Tenant Admin',
    description: 'Manage single tenant account',
    permissions: ['users', 'courses', 'billing', 'reports'],
    userCount: 45,
    color: 'blue',
    isSystem: true,
  },
  {
    id: '3',
    name: 'Instructor',
    description: 'Create and manage courses',
    permissions: ['courses', 'students', 'grading'],
    userCount: 234,
    color: 'purple',
    isSystem: false,
  },
  {
    id: '4',
    name: 'Student',
    description: 'Access and complete courses',
    permissions: ['courses', 'submissions', 'grades'],
    userCount: 12450,
    color: 'green',
    isSystem: false,
  },
  {
    id: '5',
    name: 'Content Manager',
    description: 'Manage course content and resources',
    permissions: ['courses', 'resources', 'media'],
    userCount: 12,
    color: 'orange',
    isSystem: false,
  },
  {
    id: '6',
    name: 'Support Staff',
    description: 'Handle user support and queries',
    permissions: ['users', 'tickets', 'reports'],
    userCount: 8,
    color: 'cyan',
    isSystem: false,
  },
]

const permissionCategories = [
  {
    category: 'Platform Management',
    permissions: [
      { id: 'view_dashboard', name: 'View Dashboard', description: 'Access main dashboard' },
      { id: 'manage_tenants', name: 'Manage Tenants', description: 'Create, edit, delete tenants' },
      { id: 'view_analytics', name: 'View Analytics', description: 'Access platform analytics' },
      { id: 'system_settings', name: 'System Settings', description: 'Configure system settings' },
    ],
  },
  {
    category: 'User Management',
    permissions: [
      { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, delete users' },
      { id: 'view_users', name: 'View Users', description: 'View user list and profiles' },
      { id: 'manage_roles', name: 'Manage Roles', description: 'Create and edit roles' },
      { id: 'assign_roles', name: 'Assign Roles', description: 'Assign roles to users' },
    ],
  },
  {
    category: 'Course Management',
    permissions: [
      { id: 'manage_courses', name: 'Manage Courses', description: 'Create, edit, delete courses' },
      { id: 'view_courses', name: 'View Courses', description: 'View course list' },
      { id: 'manage_content', name: 'Manage Content', description: 'Edit course content' },
      { id: 'manage_enrollments', name: 'Manage Enrollments', description: 'Enroll/unenroll students' },
    ],
  },
  {
    category: 'Financial',
    permissions: [
      { id: 'view_billing', name: 'View Billing', description: 'View billing information' },
      { id: 'manage_billing', name: 'Manage Billing', description: 'Manage subscriptions and payments' },
      { id: 'view_transactions', name: 'View Transactions', description: 'View transaction history' },
      { id: 'manage_refunds', name: 'Manage Refunds', description: 'Process refunds' },
    ],
  },
  {
    category: 'Security & Compliance',
    permissions: [
      { id: 'security_settings', name: 'Security Settings', description: 'Configure security' },
      { id: 'view_audit_logs', name: 'View Audit Logs', description: 'Access audit logs' },
      { id: 'manage_api_keys', name: 'Manage API Keys', description: 'Create and manage API keys' },
      { id: 'data_export', name: 'Data Export', description: 'Export platform data' },
    ],
  },
]

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (roleId: string) => {
    console.log('Edit role:', roleId)
  }

  const handleDuplicate = (roleId: string) => {
    console.log('Duplicate role:', roleId)
  }

  const handleDelete = (roleId: string) => {
    console.log('Delete role:', roleId)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define roles and manage access control across the platform"
        titleAction={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Role
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Roles</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{roles.length}</span>
                  <span className="text-xs text-muted-foreground">{roles.filter(r => r.isSystem).length} system</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Users</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {roles.reduce((sum, r) => sum + r.userCount, 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">active</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom Roles</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{roles.filter(r => !r.isSystem).length}</span>
                  <span className="text-xs text-muted-foreground">user-defined</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-purple-100 text-purple-700">
                <Edit className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Permissions</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {permissionCategories.reduce((sum, cat) => sum + cat.permissions.length, 0)}
                  </span>
                  <span className="text-xs text-muted-foreground">available</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-orange-100 text-orange-700">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="roles" className="data-[state=active]:bg-background">
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-background">
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
                          {role.isSystem && (
                            <Badge variant="secondary" className="text-xs font-medium">System</Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">{role.description}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(role.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(role.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(role.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Role
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">{role.userCount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">users assigned</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">View Users</Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Permissions</span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {role.permissions.includes('all') ? 'All' : `${role.permissions.length} assigned`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.includes('all') ? (
                        <Badge variant="outline" className="text-xs font-medium">All Permissions</Badge>
                      ) : (
                        <>
                          {role.permissions.slice(0, 3).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs capitalize font-medium">
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs font-medium">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full h-10" onClick={() => handleEdit(role.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Permissions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          {permissionCategories.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{category.category}</CardTitle>
                <CardDescription>
                  {category.permissions.length} permissions available in this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox id={permission.id} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-semibold block mb-1"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
