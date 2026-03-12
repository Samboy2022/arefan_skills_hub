'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Download, FileText, Activity, AlertTriangle, Info, Filter, Calendar, User, Target, CheckCircle2, XCircle } from 'lucide-react'

const auditLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    action: 'Tenant Created',
    actor: 'super_admin@platform.com',
    target: 'Lincoln High School',
    status: 'success',
    severity: 'info',
    category: 'Tenant Management',
    ipAddress: '192.168.1.100',
    details: 'New tenant created with Enterprise plan',
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    action: 'Subscription Updated',
    actor: 'super_admin@platform.com',
    target: 'Tech Academy',
    status: 'success',
    severity: 'info',
    category: 'Billing',
    ipAddress: '192.168.1.100',
    details: 'Upgraded from Basic to Premium plan',
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    action: 'User Suspended',
    actor: 'super_admin@platform.com',
    target: 'student@lincoln.edu',
    status: 'success',
    severity: 'warning',
    category: 'User Management',
    ipAddress: '192.168.1.100',
    details: 'User suspended due to policy violation',
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    action: 'Settings Modified',
    actor: 'super_admin@platform.com',
    target: 'Email Configuration',
    status: 'success',
    severity: 'info',
    category: 'System Settings',
    ipAddress: '192.168.1.100',
    details: 'SMTP settings updated',
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    action: 'Failed Login',
    actor: 'unknown@email.com',
    target: 'Admin Dashboard',
    status: 'failed',
    severity: 'danger',
    category: 'Security',
    ipAddress: '203.0.113.45',
    details: 'Multiple failed login attempts detected',
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    action: 'API Key Generated',
    actor: 'super_admin@platform.com',
    target: 'Third-party Integration',
    status: 'success',
    severity: 'info',
    category: 'API Management',
    ipAddress: '192.168.1.100',
    details: 'New API key created for external service',
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    action: 'Course Deleted',
    actor: 'super_admin@platform.com',
    target: 'Introduction to Python',
    status: 'success',
    severity: 'warning',
    category: 'Content Management',
    ipAddress: '192.168.1.100',
    details: 'Course permanently deleted from system',
  },
  {
    id: 8,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    action: 'Database Backup',
    actor: 'system',
    target: 'Production Database',
    status: 'success',
    severity: 'info',
    category: 'System Maintenance',
    ipAddress: 'localhost',
    details: 'Automated daily backup completed',
  },
]

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const totalLogs = auditLogs.length
  const successLogs = auditLogs.filter((l) => l.status === 'success').length
  const failedLogs = auditLogs.filter((l) => l.status === 'failed').length
  const infoLogs = auditLogs.filter((l) => l.severity === 'info').length
  const warningLogs = auditLogs.filter((l) => l.severity === 'warning').length
  const dangerLogs = auditLogs.filter((l) => l.severity === 'danger').length

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'security' && log.category === 'Security') ||
      (activeTab === 'system' && (log.category === 'System Settings' || log.category === 'System Maintenance')) ||
      (activeTab === 'user' && log.category === 'User Management')
    
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Complete activity log of all platform events and actions"
        titleAction={
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Events</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{totalLogs}</span>
                  <span className="text-xs text-muted-foreground">{successLogs} success</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Info Events</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{infoLogs}</span>
                  <span className="text-xs text-muted-foreground">normal</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Warnings</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{warningLogs}</span>
                  <span className="text-xs text-muted-foreground">review</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-yellow-100 text-yellow-700">
                <Activity className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Critical</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{dangerLogs}</span>
                  <span className="text-xs text-muted-foreground">urgent</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-red-100 text-red-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, action, or target..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="tenant">Tenant Management</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="system">System Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="danger">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="24h">
              <SelectTrigger className="w-[140px] h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All Events ({totalLogs})
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background">
            Security ({auditLogs.filter(l => l.category === 'Security').length})
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-background">
            System ({auditLogs.filter(l => l.category === 'System Settings' || l.category === 'System Maintenance').length})
          </TabsTrigger>
          <TabsTrigger value="user" className="data-[state=active]:bg-background">
            User Actions ({auditLogs.filter(l => l.category === 'User Management').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          log.severity === 'danger'
                            ? 'bg-red-100 text-red-700'
                            : log.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {log.status === 'success' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-700" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-lg">{log.action}</h3>
                            <Badge
                              variant="outline"
                              className={
                                log.status === 'success'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }
                            >
                              {log.status}
                            </Badge>
                            <Badge variant="outline" className="bg-muted">
                              {log.category}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>Actor: <span className="font-medium text-foreground">{log.actor}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>Target: <span className="font-medium text-foreground">{log.target}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{log.timestamp.toLocaleString()}</span>
                              <span className="text-xs">• IP: {log.ipAddress}</span>
                            </div>
                          </div>
                          
                          {log.details && (
                            <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                              {log.details}
                            </p>
                          )}
                        </div>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No audit logs found matching your filters</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
