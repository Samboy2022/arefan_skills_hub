"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = ["general", "email", "storage", "payment"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Settings"
        description="Configure your school administration system"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {/* General Settings */}
        {activeTab === "general" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">General Information</h3>
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" defaultValue="My School" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-email">Contact Email</Label>
                <Input
                  id="school-email"
                  defaultValue="admin@school.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-phone">Phone Number</Label>
                <Input
                  id="school-phone"
                  defaultValue="+91-9876543210"
                />
              </div>
              <div className="pt-2 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Email Configuration</h3>
            <div className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.gmail.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
              <div className="pt-2 flex justify-end">
                <Button>Save Email Settings</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Storage Settings */}
        {activeTab === "storage" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Storage Settings</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configure cloud storage for documents and media
            </p>
            <div className="flex justify-end">
              <Button>Connect Storage</Button>
            </div>
          </Card>
        )}

        {/* Payment Settings */}
        {activeTab === "payment" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Payment Gateway</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Set up payment gateway for fee collection
            </p>
            <div className="flex justify-end">
              <Button>Configure Payment</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
