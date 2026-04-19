"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Bell, Settings, Shield } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// Components
import { ProfileTab } from "@/components/instructor/settings/ProfileTab";
import { NotificationsTab } from "@/components/instructor/settings/NotificationsTab";
import { PreferencesTab } from "@/components/instructor/settings/PreferencesTab";
import { SecurityTab } from "@/components/instructor/settings/SecurityTab";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  
  const VALID_TABS = ["profile", "notifications", "preferences", "security"];
  const currentTab = VALID_TABS.includes(rawTab || "") ? rawTab! : "profile";

  // If there's no tab in URL, reflect the default in URL gracefully
  useEffect(() => {
    if (!rawTab || !VALID_TABS.includes(rawTab)) {
      router.replace("/instructor/settings?tab=profile", { scroll: false });
    }
  }, [rawTab, router]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb 
        showHome={false}
        items={[
          { label: "Dashboard", href: "/instructor" },
          { label: "Settings" }
        ]} 
      />
      
      <div className="pt-2">
        <PageHeader
          title="Account Settings"
          description="Manage your profile, preferences, and security."
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-56 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-3 hidden md:block text-foreground ml-2">Settings</h3>
          <nav className="flex md:flex-col overflow-x-auto pb-2 md:pb-0 gap-1 md:gap-1.5 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(`/instructor/settings?tab=${tab.id}`, { scroll: false })}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-200 flex-1 md:flex-none justify-center md:justify-start font-medium text-sm",
                    isActive
                      ? "bg-primary/5 text-primary border border-transparent md:border-transparent md:border-l-2 md:border-l-primary md:rounded-l-none"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent md:border-l-2 md:border-l-transparent md:rounded-l-none"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
          {currentTab === "profile" && <ProfileTab />}
          {currentTab === "notifications" && <NotificationsTab />}
          {currentTab === "preferences" && <PreferencesTab />}
          {currentTab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground animate-pulse font-medium">Loading settings...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
