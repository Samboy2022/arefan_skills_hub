"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Info
} from "lucide-react";
import Link from "next/link";
import { mockCourses } from "@/lib/tenant-mock-data";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/students");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/school-admin/students");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New User"
        description="Fill in the details below to register a new user to the platform or bulk import."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload (CSV/Excel)</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-base font-semibold text-foreground mb-5">Personal Information</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                      <Input id="fullName" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-base font-semibold text-foreground mb-5">Academic Details</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="role">User Role <span className="text-destructive">*</span></Label>
                      <Select required defaultValue="student">
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="school-admin">School Admin</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="courses">Assigned Courses</Label>
                      <Select>
                        <SelectTrigger id="courses">
                          <SelectValue placeholder="Select initial course" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCourses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name} ({course.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="joinDate">Join Date <span className="text-destructive">*</span></Label>
                      <Input id="joinDate" type="date" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-base font-semibold text-foreground mb-5">Emergency Contact</h2>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input id="emergencyName" placeholder="Emergency contact name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input id="emergencyPhone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emergencyRelation">Relation</Label>
                      <Input id="emergencyRelation" placeholder="e.g. Parent, Guardian" />
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save User"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bulk" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground mb-5">Bulk Import Users</h2>
                <div className="space-y-6">
                  <div 
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                      uploadFile ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/30'
                    }`}
                  >
                    <div className="max-w-xs mx-auto">
                      {uploadFile ? (
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{uploadFile.name}</p>
                            <p className="text-sm text-muted-foreground">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setUploadFile(null)}>
                            Remove file
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">Click to upload or drag & drop</p>
                            <p className="text-sm text-muted-foreground">CSV or XLSX files only (Max 10MB)</p>
                          </div>
                          <Button asChild variant="secondary">
                            <label className="cursor-pointer">
                              Browse Files
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".csv, .xlsx, .xls"
                                onChange={handleFileUpload} 
                              />
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-background rounded-md flex items-center justify-center border shadow-sm">
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Download Template</p>
                        <p className="text-xs text-muted-foreground">Use this format for a successful import</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download .CSV
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Quick Guidelines
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Required Fields:</span> Name, Email, and Role are mandatory for all users.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Email Notifications:</span> New users will receive an invitation email with login credentials.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Bulk Limit:</span> You can import up to 500 users at once via CSV/Excel.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/10">
                <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Important Note
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ensure that your CSV file uses UTF-8 encoding to avoid issues with special characters in names or addresses.
                </p>
                <div className="mt-4 p-3 bg-background rounded border border-primary/20 text-xs">
                  <p className="font-mono text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Format: name,email,role,phone
                  </p>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  disabled={!uploadFile || isLoading}
                  onClick={handleBulkUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? "Importing..." : "Start Import"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
