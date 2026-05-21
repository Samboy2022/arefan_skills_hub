"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft, 
  Save, 
  Upload, 
  X,
  Check,
  ChevronsUpDown
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockClasses, mockFaculty } from "@/lib/tenant-mock-data";

export default function EditInstructorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());

  // In a real app we'd fetch the instructor data based on params.id
  // For now, just pre-select a class for demonstration if it exists
  useEffect(() => {
    // If the instructor had assigned classes we would parse them and select
    if (mockClasses.length > 0) {
      setSelectedClasses(new Set([mockClasses[0].id]));
    }
  }, []);

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

  return (
    <div className="space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Instructors", href: "/school-admin/instructors" },
          { label: "Edit Instructor" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Edit Instructor"
        description="Update instructor details and assigned courses."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
            </Link>
          </Button>
        }
      />

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
                  <p className="text-xs text-muted-foreground">Upload a new clear, professional photo to update.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="fullName" defaultValue="Dr. Priya Mehta" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" defaultValue="priya@school.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+91-9876543210" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue="female">
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
                  <Input id="qualification" defaultValue="M.Sc., B.Ed." />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Professional Information</h2>
              <div className="grid gap-5 sm:grid-cols-2 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="joinDate">Join Date <span className="text-destructive">*</span></Label>
                  <Input id="joinDate" type="date" defaultValue="2023-08-01" required />
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
                  <Input id="emergencyName" defaultValue="Rajesh Mehta" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input id="emergencyPhone" type="tel" defaultValue="+91-9876543211" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emergencyRelation">Relation</Label>
                  <Input id="emergencyRelation" defaultValue="Spouse" />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Update Details"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
