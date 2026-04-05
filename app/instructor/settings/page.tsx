import { User, Bell, Settings, LogOut } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Settings" }
        ]} 
      />
      <div className="pt-2">
        <PageHeader
          title="Settings"
          description="Manage your profile and preferences"
        />
      </div>

      <Tabs defaultValue="profile" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h3>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="text-sm font-medium text-foreground">Profile Picture</label>
                <div className="mt-3 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                    JS
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  defaultValue="Dr. Jane Smith"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  defaultValue="jane.smith@school.edu"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <input
                  type="text"
                  defaultValue="Computer Science"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  defaultValue="Passionate educator with 10+ years of teaching experience in Computer Science."
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground h-24 resize-none"
                />
              </div>

              {/* Office Hours */}
              <div>
                <label className="text-sm font-medium text-foreground">Office Hours</label>
                <input
                  type="text"
                  defaultValue="Tuesday & Thursday: 2-4 PM, Room 304"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">New Student Submissions</p>
                  <p className="text-xs text-muted-foreground">Get notified when students submit assignments</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Discussion Replies</p>
                  <p className="text-xs text-muted-foreground">Get notified when students reply in discussions</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Assignment Due Reminders</p>
                  <p className="text-xs text-muted-foreground">Remind me of upcoming assignment deadlines</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <input type="checkbox" className="rounded" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Weekly Digest</p>
                  <p className="text-xs text-muted-foreground">Receive a weekly summary of course activity</p>
                </div>
              </label>

              <Button>Save Preferences</Button>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Teaching Preferences
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground">Language</label>
                <select className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Time Zone</label>
                <select className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground">
                  <option>Eastern Time (ET)</option>
                  <option>Central Time (CT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Pacific Time (PT)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Use Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Easier on the eyes during late-night grading</p>
                  </div>
                </label>
              </div>

              <Button>Save Preferences</Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Security Settings</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-medium text-foreground mb-2">Password</p>
                <p className="text-sm text-muted-foreground mb-3">Last changed 3 months ago</p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-medium text-foreground mb-2">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="font-medium text-foreground mb-2">Active Sessions</p>
                <p className="text-sm text-muted-foreground mb-3">Manage devices and sessions</p>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>

              <div className="pt-6 border-t border-border">
                <Button variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
