"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  ShieldAlert, 
  Lock, 
  Layout, 
  Globe, 
  Building, 
  Briefcase 
} from "lucide-react";
import Link from "next/link";
import { PermissionAction } from "@/lib/tenant-types";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const FEATURES = [
  "Dashboard",
  "Programs",
  "Courses",
  "Curriculum",
  "Classes",
  "Lessons",
  "Assessments",
  "Students",
  "Faculty",
  "Attendance",
  "Timetable",
  "Communications",
  "Finance",
  "Reports",
  "Settings",
  "Roles"
];

const ACTIONS: { label: string; value: PermissionAction }[] = [
  { label: "Create", value: "create" },
  { label: "Read", value: "read" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
];

const DEPARTMENTS = [
  "Administration",
  "Academics",
  "Finance",
  "Human Resources",
  "IT Support"
];

export default function CreateRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  // Advanced Configurations State
  const [scope, setScope] = useState<"system" | "campus" | "department">("system");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [ipRestricted, setIpRestricted] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1h");
  const [defaultDashboard, setDefaultDashboard] = useState("Admin Dashboard");
  const [allowedDepartments, setAllowedDepartments] = useState<string[]>([]);

  // State for permissions matrix
  const [permissions, setPermissions] = useState<Record<string, Set<PermissionAction>>>(
    FEATURES.reduce((acc, feature) => {
      acc[feature] = new Set<PermissionAction>();
      return acc;
    }, {} as Record<string, Set<PermissionAction>>)
  );

  const togglePermission = (feature: string, action: PermissionAction) => {
    setPermissions(prev => {
      const newFeaturePerms = new Set(prev[feature]);
      if (newFeaturePerms.has(action)) {
        newFeaturePerms.delete(action);
      } else {
        newFeaturePerms.add(action);
      }
      return { ...prev, [feature]: newFeaturePerms };
    });
  };

  const toggleRow = (feature: string) => {
    setPermissions(prev => {
      const current = prev[feature];
      if (current.size === ACTIONS.length) {
        return { ...prev, [feature]: new Set() };
      } else {
        return { ...prev, [feature]: new Set(ACTIONS.map(a => a.value)) };
      }
    });
  };

  const toggleDepartment = (dept: string) => {
    setAllowedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/school-admin/roles");
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "User Roles", href: "/school-admin/roles" },
          { label: "Create Role" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="Create New Role"
        description="Define a new user role, set operational policies, and configure feature-level permissions."
        titleAction={
          <Button variant="outline" asChild>
            <Link href="/school-admin/roles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roles
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Information */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Role Information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="roleName">Role Name <span className="text-destructive">*</span></Label>
              <Input
                id="roleName"
                placeholder="e.g. HR Manager, Library Assistant"
                required
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the purpose of this role..."
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="max-w-2xl"
              />
            </div>
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Advanced Role Settings
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Access Scope (Left) */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground">Access Scope & Boundaries</Label>
              <div className="grid gap-3">
                <div 
                  onClick={() => setScope("system")}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    scope === "system" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Globe className={`mt-0.5 h-4 w-4 shrink-0 ${scope === "system" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">System-wide</p>
                    <p className="text-xs text-muted-foreground">Unrestricted access across all school campuses and systems.</p>
                  </div>
                </div>

                <div 
                  onClick={() => setScope("campus")}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    scope === "campus" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Building className={`mt-0.5 h-4 w-4 shrink-0 ${scope === "campus" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Campus Specific</p>
                    <p className="text-xs text-muted-foreground">Bound to a single campus branch selected at assignment time.</p>
                  </div>
                </div>

                <div 
                  onClick={() => setScope("department")}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    scope === "department" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Briefcase className={`mt-0.5 h-4 w-4 shrink-0 ${scope === "department" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Department Specific</p>
                    <p className="text-xs text-muted-foreground">Restrict scope purely to records within their own assigned department.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Sessions (Right) */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-foreground">Security Policies</Label>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/10">
                  <div className="space-y-0.5 pr-4">
                    <Label htmlFor="mfa-switch" className="text-sm font-medium cursor-pointer">Require Multi-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Enforces secure SMS or Authenticator app login verification.</p>
                  </div>
                  <Switch 
                    id="mfa-switch" 
                    checked={mfaRequired} 
                    onCheckedChange={setMfaRequired} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/10">
                  <div className="space-y-0.5 pr-4">
                    <Label htmlFor="ip-switch" className="text-sm font-medium cursor-pointer">Restrict to School Network</Label>
                    <p className="text-xs text-muted-foreground">Limits account access strictly from permitted school IP addresses.</p>
                  </div>
                  <Switch 
                    id="ip-switch" 
                    checked={ipRestricted} 
                    onCheckedChange={setIpRestricted} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout" className="text-sm font-semibold text-foreground">Session Timeout Limit</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger id="session-timeout" className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Select timeout limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 minutes (Highly Secure)</SelectItem>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour (Default)</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="8h">8 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Inactivity duration before the user is automatically logged out.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-8 pt-6 border-t border-border">
            {/* Primary Landing Dashboard */}
            <div className="space-y-2">
              <Label htmlFor="default-dashboard" className="text-sm font-semibold text-foreground">Primary Landing Dashboard</Label>
              <div className="flex items-center gap-2 max-w-md">
                <Layout className="h-4 w-4 text-muted-foreground shrink-0" />
                <Select value={defaultDashboard} onValueChange={setDefaultDashboard}>
                  <SelectTrigger id="default-dashboard" className="w-full">
                    <SelectValue placeholder="Select primary dashboard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin Dashboard">Admin Dashboard (Full Overview)</SelectItem>
                    <SelectItem value="Tutor Dashboard">Tutor Dashboard (Classes & Markbooks)</SelectItem>
                    <SelectItem value="Learner Dashboard">Learner Dashboard (Academics & Schedule)</SelectItem>
                    <SelectItem value="Finance Dashboard">Finance Dashboard (Fees & Collections)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">The homepage the user will land on immediately after logging in.</p>
            </div>

            {/* Permitted Departments */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Permitted Departments</Label>
              <div className="flex gap-2 flex-wrap pt-1">
                {DEPARTMENTS.map(dept => {
                  const selected = allowedDepartments.includes(dept);
                  return (
                    <Badge 
                      key={dept} 
                      onClick={() => toggleDepartment(dept)}
                      variant={selected ? "default" : "outline"}
                      className={`px-3 py-1 cursor-pointer transition-colors text-xs font-normal rounded-full ${
                        selected 
                          ? "bg-primary text-primary-foreground hover:bg-primary/95" 
                          : "bg-background text-muted-foreground hover:bg-secondary/40"
                      }`}
                    >
                      {dept}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Attach department scopes to enable department-level directory lookups.</p>
            </div>
          </div>
        </Card>

        {/* Access Permissions */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Access Permissions Matrix
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Configure CRUD operations (Create, Read, Update, Delete) for each system feature module.</p>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/20 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Feature Module</th>
                    <th className="px-4 py-3.5 font-semibold text-center w-28">Full Access</th>
                    {ACTIONS.map(action => (
                      <th key={action.value} className="px-4 py-3.5 font-semibold text-center w-24">
                        {action.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {FEATURES.map((feature) => {
                    const featurePerms = permissions[feature];
                    const isAllSelected = featurePerms.size === ACTIONS.length;
                    const isIndeterminate = featurePerms.size > 0 && featurePerms.size < ACTIONS.length;

                    return (
                      <tr key={feature} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-foreground">{feature}</td>
                        <td className="px-4 py-3.5 text-center">
                          <Checkbox
                            checked={isAllSelected}
                            data-state={isIndeterminate ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
                            onCheckedChange={() => toggleRow(feature)}
                            aria-label={`Select all for ${feature}`}
                          />
                        </td>
                        {ACTIONS.map(action => (
                          <td key={action.value} className="px-4 py-3.5 text-center">
                            <Checkbox
                              checked={featurePerms.has(action.value)}
                              onCheckedChange={() => togglePermission(feature, action.value)}
                              aria-label={`Select ${action.label} for ${feature}`}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <Button type="submit" className="min-w-[150px] shadow-sm hover:opacity-95" disabled={isLoading}>
            {isLoading ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Role
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="shadow-xs hover:bg-secondary/40">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
