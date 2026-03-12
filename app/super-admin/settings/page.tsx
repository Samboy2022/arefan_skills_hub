'use client'

import { useState } from 'react'
import { 
  Save, 
  Settings as SettingsIcon, 
  Mail, 
  Database, 
  CreditCard, 
  Key, 
  Building2,
  Eye,
  EyeOff,
  TestTube,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Globe,
  Server,
  Shield
} from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [showS3Secret, setShowS3Secret] = useState(false)
  const [showStripeSecret, setShowStripeSecret] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const apiKeys = [
    { id: '1', name: 'Production API', key: 'sk_live_••••••••••••••••', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development API', key: 'sk_test_••••••••••••••••', created: '2024-01-10', lastUsed: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure platform-wide settings and integrations"
        titleAction={
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SMTP Status</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last tested 5 min ago</p>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                <Mail className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Storage</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">2.4 TB used</p>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <Database className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payments</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">Live</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Stripe connected</p>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-purple-100 text-purple-700">
                <CreditCard className="h-4 w-4" />
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
                  <span className="text-2xl font-bold">{apiKeys.length}</span>
                  <span className="text-xs text-muted-foreground">active</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-orange-100 text-orange-700">
                <Key className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-background">
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-background">
            Email (SMTP)
          </TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-background">
            Storage
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-background">
            Payments
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-background">
            API Keys
          </TabsTrigger>
          <TabsTrigger value="tenancy" className="data-[state=active]:bg-background">
            Multi-Tenancy
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="LMS Platform" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-url">Platform URL</Label>
                  <Input id="platform-url" defaultValue="https://lms.example.com" className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Enable or disable platform-wide features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-xs text-muted-foreground">Allow new users to register</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification</Label>
                  <p className="text-xs text-muted-foreground">Require email verification for new users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Put platform in maintenance mode</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-xs text-muted-foreground">Enable detailed error logging</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email (SMTP) Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" defaultValue="smtp.sendgrid.net" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" placeholder="587" defaultValue="587" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="apikey" defaultValue="apikey" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password / API Key</Label>
                  <div className="relative">
                    <Input
                      id="smtp-password"
                      type={showSmtpPassword ? 'text' : 'password'}
                      defaultValue="SG.••••••••••••••••••••"
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    >
                      {showSmtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" type="email" defaultValue="noreply@example.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input id="from-name" defaultValue="LMS Platform" className="h-11" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Use TLS/SSL</Label>
                  <p className="text-xs text-muted-foreground">Enable secure connection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button className="flex-1">Save SMTP Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Storage Provider</CardTitle>
              <CardDescription>Configure cloud storage for files and media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storage-provider">Storage Provider</Label>
                <Select defaultValue="s3">
                  <SelectTrigger id="storage-provider" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="r2">Cloudflare R2</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>S3 / R2 Configuration</CardTitle>
              <CardDescription>Amazon S3 or Cloudflare R2 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="s3-bucket">Bucket Name</Label>
                  <Input id="s3-bucket" placeholder="my-lms-bucket" defaultValue="lms-production" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s3-region">Region</Label>
                  <Input id="s3-region" placeholder="us-east-1" defaultValue="us-east-1" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="s3-access-key">Access Key ID</Label>
                  <Input id="s3-access-key" defaultValue="AKIA••••••••••••••••" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s3-secret-key">Secret Access Key</Label>
                  <div className="relative">
                    <Input
                      id="s3-secret-key"
                      type={showS3Secret ? 'text' : 'password'}
                      defaultValue="••••••••••••••••••••••••••••••••"
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11"
                      onClick={() => setShowS3Secret(!showS3Secret)}
                    >
                      {showS3Secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s3-endpoint">Custom Endpoint (Optional)</Label>
                <Input id="s3-endpoint" placeholder="https://s3.amazonaws.com" className="h-11" />
                <p className="text-xs text-muted-foreground">Leave empty for AWS S3, or provide R2 endpoint</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Public Access</Label>
                  <p className="text-xs text-muted-foreground">Make uploaded files publicly accessible</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button className="flex-1">Save Storage Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateways Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>Configure Stripe payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe-mode">Mode</Label>
                <Select defaultValue="live">
                  <SelectTrigger id="stripe-mode" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode</SelectItem>
                    <SelectItem value="live">Live Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe-publishable">Publishable Key</Label>
                <Input id="stripe-publishable" defaultValue="pk_live_••••••••••••••••••••" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe-secret">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="stripe-secret"
                    type={showStripeSecret ? 'text' : 'password'}
                    defaultValue="sk_live_••••••••••••••••••••••••••••••••"
                    className="h-11"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11"
                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                  >
                    {showStripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <Input id="stripe-webhook" defaultValue="whsec_••••••••••••••••••••" className="h-11" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <Input id="stripe-webhook" defaultValue="whsec_••••••••••••••••••••" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Enable Stripe</Label>
                  <p className="text-xs text-muted-foreground">Accept payments via Stripe</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="w-full">Save Payment Settings</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Default currency and formatting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" placeholder="0" defaultValue="0" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for third-party integrations</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <Card key={key.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{key.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {key.key.includes('live') ? 'Live' : 'Test'}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">{key.key}</code>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>Created: {key.created}</span>
                              <span>Last used: {key.lastUsed}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Access API documentation and examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use these API keys to integrate with external services and build custom applications.
                </p>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  View API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-Tenancy Tab */}
        <TabsContent value="tenancy" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Multi-Tenancy Configuration</CardTitle>
              <CardDescription>Configure tenant isolation and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-mode">Tenancy Mode</Label>
                <Select defaultValue="subdomain">
                  <SelectTrigger id="tenant-mode" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subdomain">Subdomain (tenant.example.com)</SelectItem>
                    <SelectItem value="path">Path (/tenant)</SelectItem>
                    <SelectItem value="domain">Custom Domain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-domain">Base Domain</Label>
                <Input id="base-domain" placeholder="example.com" defaultValue="lms.example.com" className="h-11" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Tenant Isolation</Label>
                  <p className="text-xs text-muted-foreground">Strict data isolation between tenants</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Provisioning</Label>
                  <p className="text-xs text-muted-foreground">Automatically create tenant databases</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Custom Domains</Label>
                  <p className="text-xs text-muted-foreground">Allow tenants to use custom domains</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Tenant Limits</CardTitle>
              <CardDescription>Default limits for new tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max-users">Max Users per Tenant</Label>
                  <Input id="max-users" type="number" placeholder="1000" defaultValue="1000" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-storage">Max Storage (GB)</Label>
                  <Input id="max-storage" type="number" placeholder="100" defaultValue="100" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max-courses">Max Courses</Label>
                  <Input id="max-courses" type="number" placeholder="50" defaultValue="50" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-api-calls">Max API Calls/Day</Label>
                  <Input id="max-api-calls" type="number" placeholder="10000" defaultValue="10000" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
