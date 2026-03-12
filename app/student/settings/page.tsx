import { User, Bell, Eye, Lock, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile Settings */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Update your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="john.doe@university.edu"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Student ID</label>
            <input
              type="text"
              defaultValue="STU-2024-001234"
              disabled
              className="w-full px-3 py-2 border border-border rounded-lg bg-muted opacity-50"
            />
          </div>

          <div className="pt-4 border-t">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {[
            { label: "Assignment Due Reminders", description: "Get notified 24 hours before assignments are due" },
            { label: "Grade Notifications", description: "Receive alerts when grades are posted" },
            { label: "Course Announcements", description: "Get notified of new course announcements" },
            { label: "Message Notifications", description: "Receive alerts for new messages" },
            { label: "Quiz Reminders", description: "Get reminded about upcoming quizzes" },
          ].map((setting, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy & Visibility */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Eye className="h-5 w-5" />
          Privacy & Visibility
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Allow classmates to see your profile</p>
            </div>
            <select className="px-3 py-2 border border-border rounded-lg">
              <option>Public</option>
              <option>Private</option>
              <option>Classmates Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Show Grades</p>
              <p className="text-sm text-muted-foreground">Let classmates see your grades in discussions</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5" />
          Security
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Change Password</p>
            <p className="text-sm text-muted-foreground mb-4">Update your password regularly for security</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Active Sessions</p>
            <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
            <Button variant="outline">View Sessions</Button>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-700">
          <LogOut className="h-5 w-5" />
          Account Actions
        </h3>

        <div className="space-y-2">
          <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-100">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-100">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
