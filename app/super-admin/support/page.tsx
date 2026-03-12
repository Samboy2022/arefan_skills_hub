'use client'

import { useState } from 'react'
import { Plus, Ticket, Clock, CheckCircle2, AlertTriangle, Search, Filter, MessageSquare, User, Building2, Calendar, TrendingUp, Mail } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const tickets = [
  {
    id: 'TICKET-001',
    subject: 'Course not loading',
    description: 'Students are unable to access the Introduction to Python course. Error message appears when clicking on course materials.',
    priority: 'high',
    status: 'open',
    category: 'Technical',
    tenant: 'Lincoln High School',
    assignee: 'John Doe',
    requester: 'admin@lincoln.edu',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    responseTime: '15 min',
    messages: 3,
  },
  {
    id: 'TICKET-002',
    subject: 'Payment processing issue',
    description: 'Unable to process subscription renewal payment. Payment gateway returning error code 500.',
    priority: 'critical',
    status: 'open',
    category: 'Billing',
    tenant: 'Tech Academy',
    assignee: 'Jane Smith',
    requester: 'billing@techacademy.com',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responseTime: '5 min',
    messages: 8,
  },
  {
    id: 'TICKET-003',
    subject: 'Feature request: export grades',
    description: 'Request to add functionality to export student grades in CSV and Excel formats.',
    priority: 'low',
    status: 'open',
    category: 'Feature Request',
    tenant: 'University Online',
    assignee: 'Unassigned',
    requester: 'faculty@university.edu',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    responseTime: 'N/A',
    messages: 1,
  },
  {
    id: 'TICKET-004',
    subject: 'Login issues resolved',
    description: 'Users were experiencing login failures. Issue was resolved by clearing cache and updating authentication tokens.',
    priority: 'medium',
    status: 'resolved',
    category: 'Technical',
    tenant: 'Tech Academy',
    assignee: 'John Doe',
    requester: 'support@techacademy.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    responseTime: '10 min',
    messages: 5,
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TICKET-005',
    subject: 'Database backup completed',
    description: 'Requested manual database backup has been completed successfully.',
    priority: 'low',
    status: 'resolved',
    category: 'System',
    tenant: 'Lincoln High School',
    assignee: 'Jane Smith',
    requester: 'it@lincoln.edu',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    responseTime: '30 min',
    messages: 2,
    resolvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TICKET-006',
    subject: 'User permissions not working',
    description: 'Instructor unable to access gradebook despite having correct permissions assigned.',
    priority: 'high',
    status: 'in-progress',
    category: 'Technical',
    tenant: 'University Online',
    assignee: 'John Doe',
    requester: 'instructor@university.edu',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    responseTime: '8 min',
    messages: 6,
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const openTickets = tickets.filter((t) => t.status === 'open')
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved')
  const criticalTickets = openTickets.filter((t) => t.priority === 'critical')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Tickets"
        description="Manage customer support tickets and issues"
        titleAction={
          <Button className="h-10">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Open Tickets</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{openTickets.length}</span>
                  <span className="text-xs text-muted-foreground">active</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <Ticket className="h-4 w-4" />
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
                  <span className="text-2xl font-bold">{criticalTickets.length}</span>
                  <span className="text-xs text-muted-foreground">urgent</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-red-100 text-red-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</span>
                  <span className="text-xs text-muted-foreground">working</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-yellow-100 text-yellow-700">
                <Clock className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Resolved</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{resolvedTickets.length}</span>
                  <span className="text-xs text-muted-foreground">closed</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by ID, subject, or tenant..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="open" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="open" className="data-[state=active]:bg-background">
            Open Tickets ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="data-[state=active]:bg-background">
            In Progress ({tickets.filter(t => t.status === 'in-progress').length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-background">
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All Tickets ({tickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {ticket.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          ticket.priority === 'critical'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : ticket.priority === 'high'
                            ? 'bg-orange-100 text-orange-800 border-orange-200'
                            : ticket.priority === 'medium'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-muted">
                        {ticket.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>🏫 {ticket.tenant}</span>
                      <span>👤 {ticket.assignee}</span>
                      <span>🕒 {ticket.createdAt.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                      View
                    </Button>
                    <Button size="sm" className="h-9">Resolve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {tickets.filter(t => t.status === 'in-progress').map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {ticket.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          ticket.priority === 'critical'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : ticket.priority === 'high'
                            ? 'bg-orange-100 text-orange-800 border-orange-200'
                            : ticket.priority === 'medium'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        IN PROGRESS
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>🏫 {ticket.tenant}</span>
                      <span>👤 {ticket.assignee}</span>
                      <span>🕒 {ticket.createdAt.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                      View
                    </Button>
                    <Button size="sm" className="h-9">Resolve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedTickets.length > 0 ? (
            resolvedTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {ticket.id}
                        </span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          RESOLVED
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span>🏫 {ticket.tenant}</span>
                        <span>👤 {ticket.assignee}</span>
                        <span>🕒 {ticket.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No resolved tickets yet</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {ticket.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          ticket.status === 'resolved'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : ticket.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }
                      >
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>🏫 {ticket.tenant}</span>
                      <span>👤 {ticket.assignee}</span>
                      <span>🕒 {ticket.createdAt.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-9">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
