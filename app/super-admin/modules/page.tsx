'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Video, 
  FileText, 
  BarChart3, 
  Award, 
  Trophy,
  Settings,
  Save,
  RotateCcw,
  Package,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const modules = [
  {
    id: '1',
    name: 'Course Management',
    description: 'Create, organize, and manage courses with rich content',
    icon: BookOpen,
    enabled: true,
    category: 'core',
    features: ['Course Builder', 'Content Library', 'Prerequisites'],
    color: 'blue',
  },
  {
    id: '2',
    name: 'Grade Book',
    description: 'Comprehensive grade tracking and reporting system',
    icon: GraduationCap,
    enabled: true,
    category: 'core',
    features: ['Grade Calculation', 'Weighted Grades', 'Export Reports'],
    color: 'green',
  },
  {
    id: '3',
    name: 'Discussion Boards',
    description: 'Interactive student discussion forums and Q&A',
    icon: MessageSquare,
    enabled: true,
    category: 'core',
    features: ['Threaded Discussions', 'Moderation', 'Notifications'],
    color: 'purple',
  },
  {
    id: '4',
    name: 'Video Streaming',
    description: 'Live and recorded video content delivery',
    icon: Video,
    enabled: true,
    category: 'core',
    features: ['Live Streaming', 'Video Library', 'Transcoding'],
    color: 'red',
  },
  {
    id: '5',
    name: 'Assignments & Submissions',
    description: 'Assignment creation and submission management',
    icon: FileText,
    enabled: true,
    category: 'core',
    features: ['File Upload', 'Plagiarism Check', 'Peer Review'],
    color: 'orange',
  },
  {
    id: '6',
    name: 'Analytics & Reports',
    description: 'Advanced analytics and custom reporting tools',
    icon: BarChart3,
    enabled: true,
    category: 'core',
    features: ['Custom Reports', 'Data Export', 'Dashboards'],
    color: 'cyan',
  },
  {
    id: '7',
    name: 'Certificate Generation',
    description: 'Automated course completion certificates',
    icon: Award,
    enabled: false,
    category: 'premium',
    features: ['Custom Templates', 'Digital Signatures', 'Verification'],
    color: 'yellow',
  },
  {
    id: '8',
    name: 'Gamification',
    description: 'Points, badges, and leaderboard system',
    icon: Trophy,
    enabled: false,
    category: 'premium',
    features: ['Points System', 'Badges', 'Leaderboards'],
    color: 'pink',
  },
]

export default function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const coreModules = filteredModules.filter(m => m.category === 'core')
  const premiumModules = filteredModules.filter(m => m.category === 'premium')
  const enabledCount = modules.filter(m => m.enabled).length
  const totalFeatures = modules.reduce((sum, m) => sum + m.features.length, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modules & Features"
        description="Enable or disable platform features and modules"
        titleAction={
          <div className="flex gap-2">
            <Button variant="outline" disabled={!hasChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Modules</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{modules.length}</span>
                  <span className="text-xs text-muted-foreground">{coreModules.length} core</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-blue-100 text-blue-700">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Enabled</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{enabledCount}</span>
                  <span className="text-xs text-green-600 font-medium">{((enabledCount / modules.length) * 100).toFixed(0)}%</span>
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Disabled</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{modules.length - enabledCount}</span>
                  <span className="text-xs text-muted-foreground">available</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-red-100 text-red-700">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Features</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{totalFeatures}</span>
                  <span className="text-xs text-muted-foreground">total</span>
                </div>
              </div>
              <div className="ml-3 rounded-lg p-2 bg-purple-100 text-purple-700">
                <Settings className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All Modules
          </TabsTrigger>
          <TabsTrigger value="core" className="data-[state=active]:bg-background">
            Core ({coreModules.length})
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-background">
            Premium ({premiumModules.length})
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredModules.map((module) => {
              const Icon = module.icon
              return (
                <Card key={module.id} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
                          <Badge variant={module.category === 'core' ? 'default' : 'secondary'} className="text-xs font-medium capitalize">
                            {module.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                      <Switch 
                        defaultChecked={module.enabled}
                        onCheckedChange={() => setHasChanges(true)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Included Features</p>
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs font-medium">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-9">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Module
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="core" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {coreModules.map((module) => {
              const Icon = module.icon
              return (
                <Card key={module.id} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
                          <Badge variant="default" className="text-xs font-medium">core</Badge>
                        </div>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                      <Switch 
                        defaultChecked={module.enabled}
                        onCheckedChange={() => setHasChanges(true)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Included Features</p>
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs font-medium">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-9">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Module
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {premiumModules.map((module) => {
              const Icon = module.icon
              return (
                <Card key={module.id} className="hover:shadow-lg transition-all border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CardTitle className="text-lg font-semibold">{module.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs font-medium">premium</Badge>
                        </div>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                      <Switch 
                        defaultChecked={module.enabled}
                        onCheckedChange={() => setHasChanges(true)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Included Features</p>
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs font-medium">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-9">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Module
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
