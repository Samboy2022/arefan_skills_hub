"use client";

import { MapPin, Calendar, Save, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditProfilePage() {
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
    router.push("/student/profile");
  };

  return (
    <div className="space-y-8">
      <Breadcrumb 
        items={[
          { label: "Profile", href: "/student/profile" },
          { label: "Edit Profile" }
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student/profile">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <PageHeader
           title="Edit Profile"
           description="Update your personal and contact information"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border border-border bg-card p-6">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">We support JPG, PNG up to 5MB.</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" type="button">Upload New</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" type="button">Remove</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">University Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@university.edu" disabled />
                <p className="text-xs text-muted-foreground">University email cannot be changed.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" placeholder="Phone Number" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Computer Science major heavily interested in software engineering and web development."
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="pt-6 border-t border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button variant="outline" asChild>
                <Link href="/student/profile">Cancel</Link>
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
