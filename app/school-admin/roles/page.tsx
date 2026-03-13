"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function RolesPage() {
  const roles = [
    {
      id: 1,
      name: "Principal",
      description: "Full system access and administration",
      users: 1,
      permissions: ["All"],
    },
    {
      id: 2,
      name: "Teacher",
      description: "Can manage classes, marks, and attendance",
      users: 12,
      permissions: ["Manage Classes", "View Marks", "Attendance"],
    },
    {
      id: 3,
      name: "Accountant",
      description: "Can manage financial records",
      users: 2,
      permissions: ["Finance", "Reports"],
    },
    {
      id: 4,
      name: "Student",
      description: "Can view grades and academic info",
      users: 178,
      permissions: ["View Grades", "View Timetable"],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Roles & Permissions"
        description="Manage roles and assign permissions"
        titleAction={
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground leading-none">{role.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {role.description}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                <span>Permissions</span>
                <span className="text-xs text-muted-foreground font-normal bg-secondary px-2 py-0.5 rounded-full">{role.users} assigned</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs font-normal">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
