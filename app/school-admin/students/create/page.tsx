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
import { mockCourses } from "@/lib/tenant-mock-data";

export default function CreateUserPage() {
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
        title="Add New User"
        description="Fill in the details below to register a new user to the platform."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input id="fullName" placeholder="Enter full name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="user@example.com" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role of users <span className="text-destructive">*</span></Label>
                <Select required>
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
                <Label htmlFor="courses">Courses assigned to the User</Label>
                <Select>
                  <SelectTrigger id="courses">
                    <SelectValue placeholder="Select assigned course" />
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

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
