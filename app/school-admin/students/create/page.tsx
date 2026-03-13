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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateStudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/students");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Student"
        description="Fill in the details below to register a new student."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Personal Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="fullName" placeholder="e.g. Arjun Sharma" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rollNumber">Roll Number <span className="text-destructive">*</span></Label>
                  <Input id="rollNumber" placeholder="e.g. STU2024001" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="student@school.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91-9876543210" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" />
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

            {/* Academic Information */}
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Academic Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map(c => (
                        <SelectItem key={c} value={c.toLowerCase().replace(" ", "-")}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Select>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
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

          {/* Parent / Guardian Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Parent / Guardian</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="parentName">Parent Name <span className="text-destructive">*</span></Label>
                  <Input id="parentName" placeholder="e.g. Rajesh Sharma" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parentPhone">Parent Phone <span className="text-destructive">*</span></Label>
                  <Input id="parentPhone" type="tel" placeholder="+91-9876543210" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parentEmail">Parent Email</Label>
                  <Input id="parentEmail" type="email" placeholder="parent@email.com" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground mb-5">Address</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="Street address" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" placeholder="e.g. 400001" maxLength={6} />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Student"}
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
