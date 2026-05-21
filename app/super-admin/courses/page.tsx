'use client'

import { useState } from 'react'
import { Eye, Search, BookOpen, TrendingUp, DollarSign, Users } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockCourses, mockTenants } from '@/lib/mock-data'
import { format } from 'date-fns'

interface CourseDetail {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  tenantId: string
  tenantName: string
  enrollments: number
  completionRate: number
  revenue: number
  status: string
  createdAt: Date
  duration: string
  level: string
  rating: number
}

const coursesData: CourseDetail[] = mockCourses.map((course, index) => {
  const tenant = mockTenants[index % mockTenants.length]
  return {
    ...course,
    tenantId: tenant.id,
    tenantName: tenant.name,
    category: ['Technology', 'Business', 'Design', 'Science', 'Mathematics'][index % 5],
    enrollments: course.students,
    completionRate: Math.floor(Math.random() * 40) + 60,
    revenue: course.students * (Math.floor(Math.random() * 5000) + 5000),
    description: 'Comprehensive course covering fundamental and advanced concepts with hands-on projects and real-world applications.',
    duration: ['4 weeks', '6 weeks', '8 weeks', '12 weeks'][index % 4],
    level: ['Beginner', 'Intermediate', 'Advanced'][index % 3],
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
  }
})

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTenant, setSelectedTenant] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const totalCourses = coursesData.length
  const avgCompletionRate = Math.round(
    coursesData.reduce((sum, course) => sum + course.completionRate, 0) / coursesData.length
  )
  const totalRevenue = coursesData.reduce((sum, course) => sum + course.revenue, 0)

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTenant = selectedTenant === 'all' || course.tenantId === selectedTenant
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    
    return matchesSearch && matchesTenant && matchesCategory
  })

  const handleViewCourse = (course: CourseDetail) => {
    setSelectedCourse(course)
    setIsDetailOpen(true)
  }

  const columns = [
    {
      header: 'Course Title',
      accessor: 'title' as const,
      cell: (value: string, row: CourseDetail) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">{row.instructor}</div>
        </div>
      ),
    },
    {
      header: 'Primary Tenant',
      accessor: 'tenantName' as const,
      cell: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      cell: (value: string) => (
        <Badge variant="outline" className="bg-muted">
          {value}
        </Badge>
      ),
    },
    {
      header: 'Enrollments',
      accessor: 'enrollments' as const,
      cell: (value: number) => (
        <span className="font-medium">{value.toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const colors: Record<string, string> = {
          published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
          draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200',
          flagged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
        }
        return (
          <Badge
            variant="outline"
            className={`capitalize ${colors[value] || ''}`}
          >
            {value}
          </Badge>
        )
      },
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (value: string, row: CourseDetail) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewCourse(row)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Course Directory"
        description="Monitor and manage courses across all institutions"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-xs text-muted-foreground">Published and draft</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                <BookOpen className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold">{totalCourses}</div>
            <p className="mt-1.5 text-xs text-muted-foreground">courses</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Completion</p>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </div>
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold">{avgCompletionRate}%</div>
            <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 font-medium">+5%</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 p-3 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Global Revenue</p>
                <p className="text-xs text-muted-foreground">From course activity</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                <DollarSign className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-xl font-bold">NGN {(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="mt-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">+12%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by course title, instructor, or tenant..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {mockTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <span>Showing {filteredCourses.length} of {totalCourses} courses</span>
            {(searchQuery || selectedTenant !== 'all' || selectedCategory !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTenant('all')
                  setSelectedCategory('all')
                }}
                className="h-7 text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course DataTable */}
      <Card className="hover:shadow-md transition-shadow">
        <DataTable
          columns={columns}
          data={filteredCourses}
          pageSize={15}
          emptyMessage="No courses found matching your filters"
        />
      </Card>

      {/* Course Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold">Course Details</DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive information about this course
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-6">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                    <p className="text-gray-600 mb-3">{selectedCourse.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Instructor: {selectedCourse.instructor}</span>
                      <span>•</span>
                      <span>Duration: {selectedCourse.duration}</span>
                      <span>•</span>
                      <span>Created: {format(new Date(selectedCourse.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white border-blue-200 text-blue-800 font-medium">
                    {selectedCourse.category}
                  </Badge>
                  <Badge variant="outline" className="bg-white border-purple-200 text-purple-800 font-medium">
                    {selectedCourse.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedCourse.status === 'published'
                        ? 'bg-green-50 text-green-800 border-green-200 font-medium'
                        : 'bg-gray-50 text-gray-800 border-gray-200 font-medium'
                    }
                  >
                    {selectedCourse.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Enrollments</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold">{selectedCourse.enrollments.toLocaleString()}</span>
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
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completion</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold">{selectedCourse.completionRate}%</span>
                        </div>
                      </div>
                      <div className="ml-3 rounded-lg p-2 bg-green-100 text-green-700">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold">{selectedCourse.rating}</span>
                        </div>
                      </div>
                      <div className="ml-3 rounded-lg p-2 bg-yellow-100 text-yellow-700">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Revenue</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold">₦{(selectedCourse.revenue / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="ml-3 rounded-lg p-2 bg-purple-100 text-purple-700">
                        <DollarSign className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tenant Information */}
              <Card className="border-2 border-blue-200 bg-blue-50/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Primary Institution</CardTitle>
                  <CardDescription className="text-base">
                    Institution that created and manages this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                        {selectedCourse.tenantName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-900 mb-2">{selectedCourse.tenantName}</h4>
                      <p className="text-gray-600 mb-3">
                        Course creator and primary administrator
                      </p>
                      <div className="flex gap-3">
                        <Badge variant="outline" className="bg-white border-blue-200 text-blue-800 font-medium">
                          Verified Institution
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 font-medium">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="h-10">
                  Close
                </Button>
                <Button className="h-10">
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
