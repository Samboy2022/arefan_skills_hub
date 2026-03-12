'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, Palette, Mail, Globe, Save, Eye, RefreshCw, Type, Layout } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BrandingPage() {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6')
  const [accentColor, setAccentColor] = useState('#10b981')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Branding & CMS"
        description="Customize your platform visual identity and content"
        titleAction={
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview Changes
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Logo Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg border-2 border-dashed bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No logo uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Theme Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg border" style={{ backgroundColor: primaryColor }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">{primaryColor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg border" style={{ backgroundColor: secondaryColor }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">{secondaryColor}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Email Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Templates</p>
                  <p className="text-xs text-muted-foreground">6 configured</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold">6</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="logo" className="data-[state=active]:bg-background">
            Logo & Assets
          </TabsTrigger>
          <TabsTrigger value="theme" className="data-[state=active]:bg-background">
            Colors & Theme
          </TabsTrigger>
          <TabsTrigger value="typography" className="data-[state=active]:bg-background">
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="data-[state=active]:bg-background">
            Layout
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-background">
            Email
          </TabsTrigger>
          <TabsTrigger value="landing" className="data-[state=active]:bg-background">
            Landing Page
          </TabsTrigger>
        </TabsList>

        {/* Logo & Assets Tab */}
        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Logos</CardTitle>
              <CardDescription>Upload and manage your platform logos for different contexts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Main Logos */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Primary Logo (Light Mode)</Label>
                  <div className="group border-2 border-dashed rounded-xl p-10 text-center bg-white dark:bg-background hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG (max. 2MB)</p>
                        <p className="text-xs text-muted-foreground">Recommended: 200x50px</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Dark Mode Logo</Label>
                  <div className="group border-2 border-dashed rounded-xl p-10 text-center bg-slate-900 hover:border-slate-600 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-slate-700 group-hover:bg-slate-600 transition-colors">
                        <Upload className="h-6 w-6 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1 text-white">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400">SVG, PNG (max. 2MB)</p>
                        <p className="text-xs text-slate-400">Recommended: 200x50px</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Assets */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Additional Assets</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Favicon</Label>
                    <div className="group border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground font-medium">32x32px ICO/PNG</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Email Logo</Label>
                    <div className="group border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground font-medium">600x150px PNG</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Social Icon</Label>
                    <div className="group border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground font-medium">512x512px PNG</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Identity */}
              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold mb-4">Platform Identity</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" placeholder="LMS Platform" defaultValue="LMS Platform" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" placeholder="Learn, Grow, Succeed" className="h-11" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors & Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Define your brand color palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <Label htmlFor="primary" className="text-base font-semibold">Primary Color</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        id="primary"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="pr-14 h-11 font-mono"
                      />
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border-2 cursor-pointer"
                      />
                    </div>
                    <div className="h-32 rounded-xl border-2 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: primaryColor }} />
                    <p className="text-xs text-muted-foreground">Buttons, links, primary actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="secondary" className="text-base font-semibold">Secondary Color</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        id="secondary"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="pr-14 h-11 font-mono"
                      />
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border-2 cursor-pointer"
                      />
                    </div>
                    <div className="h-32 rounded-xl border-2 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: secondaryColor }} />
                    <p className="text-xs text-muted-foreground">Secondary elements, accents</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="accent" className="text-base font-semibold">Accent Color</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        id="accent"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="pr-14 h-11 font-mono"
                      />
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border-2 cursor-pointer"
                      />
                    </div>
                    <div className="h-32 rounded-xl border-2 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: accentColor }} />
                    <p className="text-xs text-muted-foreground">Highlights, success states</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold mb-4">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { name: 'Default', colors: ['#3b82f6', '#8b5cf6', '#10b981'] },
                    { name: 'Warm', colors: ['#f97316', '#ef4444', '#eab308'] },
                    { name: 'Ocean', colors: ['#06b6d4', '#14b8a6', '#10b981'] },
                    { name: 'Minimal', colors: ['#475569', '#64748b', '#94a3b8'] },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto flex-col gap-3 p-4 hover:border-primary transition-all"
                      onClick={() => {
                        setPrimaryColor(preset.colors[0])
                        setSecondaryColor(preset.colors[1])
                        setAccentColor(preset.colors[2])
                      }}
                    >
                      <div className="flex gap-1.5">
                        {preset.colors.map((color, i) => (
                          <div key={i} className="h-7 w-7 rounded-md border-2 shadow-sm" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <span className="text-xs font-medium">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h4 className="text-sm font-semibold mb-4">Theme Mode</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Dark Mode Support</Label>
                      <p className="text-xs text-muted-foreground">Enable dark theme for users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Auto Theme Switching</Label>
                      <p className="text-xs text-muted-foreground">Match system preferences</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="mt-0 space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>Configure fonts and text styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-font">Primary Font Family</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger id="primary-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for body text</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heading-font">Heading Font Family</Label>
                  <Select defaultValue="poppins">
                    <SelectTrigger id="heading-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Used for headings</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-medium">Font Sizes</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="base-size">Base Size</Label>
                    <Select defaultValue="16">
                      <SelectTrigger id="base-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scale">Scale Ratio</Label>
                    <Select defaultValue="1.25">
                      <SelectTrigger id="scale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.125">Minor Second (1.125)</SelectItem>
                        <SelectItem value="1.25">Major Third (1.25)</SelectItem>
                        <SelectItem value="1.333">Perfect Fourth (1.333)</SelectItem>
                        <SelectItem value="1.5">Perfect Fifth (1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="line-height">Line Height</Label>
                    <Select defaultValue="1.5">
                      <SelectTrigger id="line-height">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.4">Tight (1.4)</SelectItem>
                        <SelectItem value="1.5">Normal (1.5)</SelectItem>
                        <SelectItem value="1.6">Relaxed (1.6)</SelectItem>
                        <SelectItem value="1.75">Loose (1.75)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Preview</h4>
                <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <h2 className="text-3xl font-bold">Heading 2</h2>
                  <h3 className="text-2xl font-semibold">Heading 3</h3>
                  <p className="text-base">This is body text. The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-sm text-muted-foreground">This is small text for captions and labels.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="mt-0 space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure global layout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rounded Corners</Label>
                    <p className="text-xs text-muted-foreground">Use rounded corners for UI elements</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing for denser layouts</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sidebar Collapsible</Label>
                    <p className="text-xs text-muted-foreground">Allow users to collapse sidebar</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Breadcrumbs</Label>
                    <p className="text-xs text-muted-foreground">Show navigation breadcrumbs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-medium">Container Width</h4>
                <div className="space-y-2">
                  <Label htmlFor="container-width">Maximum Width</Label>
                  <Select defaultValue="1280">
                    <SelectTrigger id="container-width">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024px (Compact)</SelectItem>
                      <SelectItem value="1280">1280px (Default)</SelectItem>
                      <SelectItem value="1536">1536px (Wide)</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-medium">Animation</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Animations</Label>
                    <p className="text-xs text-muted-foreground">Smooth transitions and effects</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="mt-0 space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize transactional email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { title: 'Welcome Email', desc: 'New user registration', status: 'Active' },
                  { title: 'Password Reset', desc: 'Password recovery', status: 'Active' },
                  { title: 'Course Enrollment', desc: 'Enrollment confirmation', status: 'Active' },
                  { title: 'Assignment Due', desc: 'Deadline reminders', status: 'Active' },
                  { title: 'Grade Posted', desc: 'Grade notifications', status: 'Draft' },
                  { title: 'Certificate', desc: 'Completion certificate', status: 'Draft' },
                ].map((template) => (
                  <Card key={template.title} className="hover:shadow-sm transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm">{template.title}</CardTitle>
                          <CardDescription className="text-xs">{template.desc}</CardDescription>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          template.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page Tab */}
        <TabsContent value="landing" className="mt-0 space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Landing Page CMS</CardTitle>
              <CardDescription>Customize your public landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Input id="hero-title" placeholder="Transform Education" defaultValue="Transform Education with Our LMS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Textarea id="hero-subtitle" placeholder="Empower students" rows={3} defaultValue="Empower students and educators with cutting-edge learning tools" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cta-primary">Primary CTA</Label>
                    <Input id="cta-primary" placeholder="Get Started" defaultValue="Get Started Free" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-secondary">Secondary CTA</Label>
                    <Input id="cta-secondary" placeholder="Learn More" defaultValue="Watch Demo" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-medium">Features Section</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 p-4 border rounded-lg bg-muted/30">
                      <div className="flex-1 space-y-2">
                        <Input placeholder={`Feature ${i} Title`} />
                        <Input placeholder="Description" />
                      </div>
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">+ Add Feature</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Publish Landing Page</Label>
                    <p className="text-xs text-muted-foreground">Make page publicly accessible</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
