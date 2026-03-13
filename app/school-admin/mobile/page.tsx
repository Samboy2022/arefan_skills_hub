"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

export default function MobileAppPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mobile App Settings"
        description="Configure mobile application settings"
      />

      <Card className="p-6 max-w-2xl hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mobile App Configuration</h3>
            <p className="text-sm text-muted-foreground">Version 2.1.0</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-border" />
            <span className="text-sm font-medium text-foreground">
              Enable push notifications
            </span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-border" />
            <span className="text-sm font-medium text-foreground">
              Allow offline mode for content
            </span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-sm font-medium text-foreground">
              Require biometric authentication (Face ID / Touch ID)
            </span>
          </label>

          <div className="pt-4 flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
