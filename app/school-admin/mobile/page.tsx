"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

export default function MobileAppPage() {
  return (
    <div>
      <PageHeader
        title="Mobile App Settings"
        description="Configure mobile application settings"
      />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mobile App</h3>
            <p className="text-sm text-muted-foreground">v2.1.0</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm font-medium text-foreground">
              Enable notifications
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm font-medium text-foreground">
              Allow offline mode
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm font-medium text-foreground">
              Require biometric authentication
            </span>
          </label>

          <div className="pt-4">
            <Button>Save Settings</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
