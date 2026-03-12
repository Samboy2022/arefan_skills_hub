"use client";

import { useState } from "react";
import { PageHeader } from "@/components/tenant/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = ["general", "email", "storage", "payment"];

  return (
    <div>
      <PageHeader
        title="School Settings"
        description="Configure your school administration system"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" defaultValue="My School" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="school-email">Contact Email</Label>
                <Input
                  id="school-email"
                  defaultValue="admin@school.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="school-phone">Phone Number</Label>
                <Input
                  id="school-phone"
                  defaultValue="+91-9876543210"
                  className="mt-2"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === "email" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" className="mt-2" />
            </div>
            <Button>Save Email Settings</Button>
          </div>
        </Card>
      )}

      {/* Storage Settings */}
      {activeTab === "storage" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Storage Settings</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure cloud storage for documents and media
            </p>
            <Button>Connect Storage</Button>
          </div>
        </Card>
      )}

      {/* Payment Settings */}
      {activeTab === "payment" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Gateway</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set up payment gateway for fee collection
            </p>
            <Button>Configure Payment</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
