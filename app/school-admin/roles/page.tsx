"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div>
      <PageHeader
        title="User Roles & Permissions"
        description="Manage roles and assign permissions"
        action={{
          label: "Create Role",
          onClick: () => {
            // TODO: Implement create role dialog
          },
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{role.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {role.description}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {role.users} users assigned
              </p>
              <div className="flex gap-1 flex-wrap">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">
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
