"use client";

import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotificationsPage() {
  const notificationTypes = [
    {
      id: 1,
      event: "Fee Due Reminder",
      description: "Remind parents about upcoming fee deadline",
      enabled: true,
    },
    {
      id: 2,
      event: "Attendance Alert",
      description: "Alert parents about low attendance",
      enabled: true,
    },
    {
      id: 3,
      event: "Academic Performance",
      description: "Share academic updates with parents",
      enabled: false,
    },
    {
      id: 4,
      event: "Event Notifications",
      description: "Notify about school events and activities",
      enabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Rules"
        description="Configure automatic notifications for parents and students"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {notificationTypes.map((notif) => (
          <Card key={notif.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-medium text-foreground">{notif.event}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {notif.description}
              </p>
            </div>
            <label className="flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                defaultChecked={notif.enabled}
                className="rounded w-5 h-5 border-border text-primary focus:ring-primary"
              />
            </label>
          </Card>
        ))}
      </div>

      <Card className="mt-6 hover:shadow-md transition-shadow">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-lg text-foreground">SMS Gateway Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure your SMS API keys below</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="max-w-md">
            <label className="text-sm font-medium text-foreground block mb-1.5 border-none">
              API Key
            </label>
            <Input
              type="password"
              placeholder="Enter SMS API key"
              className="w-full"
            />
          </div>
          <Button>Save Configuration</Button>
        </div>
      </Card>
    </div>
  );
}
