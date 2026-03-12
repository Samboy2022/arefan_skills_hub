'use client'

import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Shield, Lock, Key, Activity, Users, AlertTriangle, Globe, Monitor } from 'lucide-react'

const auditLogs = [
  {
    id: 1,
    action: 'Tenant Created',
    user: 'super_admin@platform.com',
    target: 'Lincoln High School',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    severity: 'info',
  },
  {
    id: 2,
    action: 'User Suspended',
    user: 'super_admin@platform.com',
    target: 'student@lincoln.edu',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    severity: 'warning',
  },
  {
    id: 3,
    action: 'Settings Changed',
    user: 'super_admin@platform.com',
    target: 'Email Configuration',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    severity: 'info',
  },
  {
    id: 4,
    action: 'Failed Login Attempt',
    user: 'unknown@email.com',
    target: 'Admin Panel',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    severity: 'danger',
  },
]

const activeSessions = [
  {
    id: 1,
    email: 'super_admin@platform.com',
    device: 'Chrome on Windows',
    location: 'New York, USA',
    ip: '192.168.1.1',
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    current: true,
  },
  {
    id: 2,
    email: 'super_admin@platform.com',
    device: 'Safari on MacOS',
    location: 'San Francisco, USA',
    ip: '192.168.1.2',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    current: false,
  },
]

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Audit"
        description="Monitor security events and manage platform security"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Security Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">98%</span>
                  <span className="text-xs text-green-600 font-medium">Excellent</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Sessions</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{activeSessions.length}</span>
                  <span className="text-xs text-muted-foreground">admin</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Failed Logins</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">1</span>
                  <span className="text-xs text-muted-foreground">last 24h</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-yellow-100 text-yellow-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">API Keys</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">2</span>
                  <span className="text-xs text-muted-foreground">active</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-purple-100 text-purple-700">
                <Key className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background">
            Security Settings
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-background">
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-background">
            Active Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
                <CardDescription>All security checks passed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Certificate</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Firewall</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Encryption</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Status</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Up to date</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
                <CardDescription>Security events requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Failed login attempt detected</p>
                    <p className="text-xs text-muted-foreground">1 hour ago from unknown@email.com</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No other alerts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Suggested improvements for platform security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Two-Factor Authentication Enabled</p>
                  <p className="text-xs text-muted-foreground mt-1">All admin accounts are protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Configure IP Whitelist</p>
                  <p className="text-xs text-muted-foreground mt-1">Restrict admin access to specific IP addresses</p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0">Configure</Button>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">API Key Rotation Enabled</p>
                  <p className="text-xs text-muted-foreground mt-1">Keys automatically rotate every 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure authentication and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password Complexity</Label>
                  <p className="text-xs text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-xs text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Attempt Limit</Label>
                  <p className="text-xs text-muted-foreground">Lock account after 5 failed attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage IP restrictions and access policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Whitelist</Label>
                  <p className="text-xs text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Geo-Blocking</Label>
                  <p className="text-xs text-muted-foreground">Block access from specific countries</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-xs text-muted-foreground">Limit API requests per minute</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>Configure encryption and data security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Database Encryption</Label>
                  <p className="text-xs text-muted-foreground">Encrypt sensitive data at rest</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SSL/TLS Enforcement</Label>
                  <p className="text-xs text-muted-foreground">Force HTTPS for all connections</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-xs text-muted-foreground">Daily encrypted backups</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Recent system and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 py-3 border-b last:border-0"
                  >
                    <div
                      className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                        log.severity === 'danger'
                          ? 'bg-red-500'
                          : log.severity === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.user} on {log.target}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        log.severity === 'danger'
                          ? 'bg-red-100 text-red-800'
                          : log.severity === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {log.severity}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Currently active admin sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">{session.email}</p>
                          {session.current && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            <span>{session.device}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>{session.location} ({session.ip})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span>Last active: {session.lastActive.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
