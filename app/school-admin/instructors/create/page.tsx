"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  Info,
  X,
  Check,
  ChevronsUpDown
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockClasses } from "@/lib/tenant-mock-data";

export default function CreateInstructorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());

  const handleClassToggle = (classId: string) => {
    const newSelection = new Set(selectedClasses);
    if (newSelection.has(classId)) {
      newSelection.delete(classId);
    } else {
      newSelection.add(classId);
    }
    setSelectedClasses(newSelection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/instructors");
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
    router.push("/school-admin/instructors");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Instructors", href: "/school-admin/instructors" },
          { label: "Add Instructor" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Add New Instructor"
        description="Fill in the details below to add a new instructor or import via Excel."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
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
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="h-20 w-20 rounded-full border-2 border-dashed border-muted flex flex-col items-center justify-center bg-muted/20 text-muted-foreground hover:bg-muted/50 cursor-pointer overflow-hidden relative">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-[10px] font-medium">Upload</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Profile Picture (Optional)</h3>
                      <p className="text-xs text-muted-foreground">Upload a clear, professional photo.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                      <Input id="fullName" placeholder="e.g. Dr. Priya Mehta" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input id="email" type="email" placeholder="instructor@school.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91-9876543210" />
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
                    <div className="grid gap-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input id="qualification" placeholder="e.g. M.Sc., B.Ed." />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-base font-semibold text-foreground mb-5">Professional Information</h2>
                  <div className="grid gap-5 sm:grid-cols-2 mb-6">
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
                          <SelectItem value="on-leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Assigned Classes to Teach</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between bg-background font-normal"
                        >
                          <span className="text-muted-foreground">Search and select a class to add...</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search class by code or title..." />
                          <CommandList>
                            <CommandEmpty>No class found.</CommandEmpty>
                            <CommandGroup>
                              {mockClasses
                                .filter((c) => !selectedClasses.has(c.id))
                                .map((cls) => (
                                  <CommandItem
                                    key={cls.id}
                                    value={`${cls.name} ${cls.courseCode}`}
                                    onSelect={() => handleClassToggle(cls.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedClasses.has(cls.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {cls.name} ({cls.courseCode})
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {selectedClasses.size > 0 && (
                      <div className="mt-4 border rounded-md divide-y overflow-hidden">
                        {Array.from(selectedClasses).map((classId) => {
                          const c = mockClasses.find((x) => x.id === classId);
                          if (!c) return null;
                          return (
                            <div key={c.id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{c.name} ({c.courseCode})</span>
                                <span className="text-xs text-muted-foreground">{c.program}</span>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleClassToggle(c.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {selectedClasses.size === 0 && (
                      <div className="text-center p-6 border border-dashed rounded-md text-sm text-muted-foreground bg-muted/20 mt-2">
                        No classes assigned yet. Search and select a class above.
                      </div>
                    )}
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
                      <Input id="emergencyPhone" type="tel" placeholder="+91-9876543210" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="emergencyRelation">Relation</Label>
                      <Input id="emergencyRelation" placeholder="e.g. Spouse, Parent" />
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Instructor"}
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
                <h2 className="text-base font-semibold text-foreground mb-5">Bulk Import Instructors</h2>
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
                      <span className="font-medium text-foreground">Required Fields:</span> Name, Email, and Qualification are mandatory.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Email Notifications:</span> New instructors will receive an invitation email.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Course Assignment:</span> Courses can be mapped via Course Code in the CSV.
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
                  Ensure that your CSV file uses UTF-8 encoding. Course codes must perfectly match the existing system courses.
                </p>
                <div className="mt-4 p-3 bg-background rounded border border-primary/20 text-xs">
                  <p className="font-mono text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Format: name,email,phone,courses
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
