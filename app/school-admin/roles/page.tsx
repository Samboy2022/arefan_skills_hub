"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Pencil } from "lucide-react";
import { mockRoles } from "@/lib/tenant-mock-data";
import { ConfirmDeleteDialog } from "@/components/school-admin/confirm-delete-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function RolesPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const handleDelete = () => {
    // In a real app, make API call here
    setDeleteId(null);
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        showHome={false}
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "User Roles" }
        ]}
        className="mb-2"
      />
      <PageHeader
        title="User Roles & Permissions"
        description="Manage roles and assign permissions across the system"
        titleAction={
          <Button onClick={() => router.push("/school-admin/roles/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockRoles.map((role) => {
          // Extract unique features this role has any access to
          const accessibleFeatures = role.permissions
            .filter(p => p.actions.length > 0)
            .map(p => p.feature);

          return (
            <Card key={role.id} className="p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-foreground leading-none">{role.name}</h3>
                    {role.isSystem && (
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">System</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {role.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/school-admin/roles/edit/${role.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!role.isSystem && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteDialog(role.id, role.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-border mt-auto">
                <p className="text-sm font-medium text-foreground mb-3 flex items-center justify-between">
                  <span>Accessible Features</span>
                  <span className="text-xs text-muted-foreground font-normal bg-secondary px-2 py-0.5 rounded-full">{role.usersCount} users assigned</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {accessibleFeatures.length > 0 ? (
                    accessibleFeatures.slice(0, 5).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs font-normal bg-background">
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No access</span>
                  )}
                  {accessibleFeatures.length > 5 && (
                    <Badge variant="outline" className="text-xs font-normal bg-background text-muted-foreground">
                      +{accessibleFeatures.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmDeleteDialog 
        open={!!deleteId} 
        onOpenChange={(open: boolean) => !open && setDeleteId(null)} 
        onConfirm={handleDelete} 
        itemName={deleteName} 
      />
    </div>
  );
}
