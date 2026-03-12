"use client";

import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div>
      <PageHeader
        title="Notification Rules"
        description="Configure automatic notifications for parents and students"
      />

      <div className="space-y-4">
        {notificationTypes.map((notif) => (
          <Card key={notif.id} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">{notif.event}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {notif.description}
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={notif.enabled}
                className="rounded w-5 h-5"
              />
            </label>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-foreground mb-4">SMS Gateway Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              API Key
            </label>
            <input
              type="password"
              placeholder="Enter SMS API key"
              className="w-full mt-2 px-3 py-2 border border-input rounded-lg"
            />
          </div>
          <Button>Save Configuration</Button>
        </div>
      </Card>
    </div>
  );
}
