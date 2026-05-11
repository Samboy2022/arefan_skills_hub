"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Shield, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AvatarUploader } from "./AvatarUploader";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(2, "Department is required"),
  title: z.string().optional(),
  bio: z.string().max(500, "Bio max 500 characters").optional(),
  officeHours: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // MOCK DEFAULT VALUES
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@school.edu",
    phone: "+1 555 000 0000",
    department: "Computer Science",
    title: "Associate Professor",
    bio: "Passionate educator with 10+ years of teaching experience in Computer Science.",
    officeHours: "Tue & Thu 2–4 PM, Room 304",
    website: "https://janesmith.edu",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onBlur"
  });

  const bioValue = form.watch("bio") || "";

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    // MOCK API CALL
    setTimeout(() => {
      setIsSaving(false);
      // Here usually we show toast success
      alert("Profile updated successfully!"); 
    }, 800);
  };

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for new email
    setEmailModalOpen(false);
    alert("Verification sent to the new email!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-muted-foreground" />
          Public Profile
        </h3>
        <p className="text-sm text-muted-foreground">
          This information will be displayed publicly to your students.
        </p>
      </div>

      <AvatarUploader />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Input disabled className="bg-muted/50 cursor-not-allowed max-w-sm" {...field} />
                  </FormControl>
                  <Button type="button" variant="link" className="px-0" onClick={() => setEmailModalOpen(true)}>
                    Change Email &rarr;
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="h-px bg-border/60 my-8"></div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Associate Professor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tue & Thu 2–4 PM, Room 304" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Website / LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 relative">
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell students about yourself..." 
                        className="resize-none h-32"
                        {...field} 
                      />
                    </FormControl>
                    <div className="absolute bottom-2 right-3 text-xs text-muted-foreground font-mono">
                      {bioValue.length} / 500
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSaving || !form.formState.isDirty} className="w-full sm:w-auto min-w-[140px]">
              {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </Form>

      {/* Change Email Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              We will send a verification link to your new address. Your email will not change until verified.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onEmailSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <FormLabel>New Email Address</FormLabel>
              <Input type="email" required placeholder="new.email@school.edu" />
            </div>
            <div className="space-y-2">
              <FormLabel>Confirm New Email</FormLabel>
              <Input type="email" required placeholder="new.email@school.edu" />
            </div>
            <div className="space-y-2">
              <FormLabel>Enter password to confirm</FormLabel>
              <Input type="password" required />
            </div>
            <DialogFooter className="pt-4 mt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>Cancel</Button>
              <Button type="submit">Verify Email</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
