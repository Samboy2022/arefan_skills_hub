"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  FileText, MessageCircle, Clock, Mail, Video, 
  AlertCircle, Bell, BarChart, BellOff, Save 
} from "lucide-react";

const DEFAULT_PREFS = [
  { id: "new_submission", label: "New Student Submissions", desc: "Assignment or quiz turned in", icon: FileText, email: true, inApp: true, push: false },
  { id: "discussion_reply", label: "Discussion Replies", desc: "Student replies in a forum thread you're watching", icon: MessageCircle, email: true, inApp: true, push: false },
  { id: "due_reminder", label: "Assignment Due Reminders", desc: "Deadlines approaching (24h, 1h before)", icon: Clock, email: true, inApp: true, push: false },
  { id: "direct_message", label: "New Direct Message", desc: "Student sends you a direct message", icon: Mail, email: true, inApp: true, push: true },
  { id: "live_class_reminder", label: "Live Class Reminders", desc: "Meeting starting soon (15 min before)", icon: Video, email: true, inApp: true, push: true },
  { id: "grade_dispute", label: "Grade Disputes", desc: "Student contests a grade", icon: AlertCircle, email: true, inApp: true, push: false },
  { id: "announcement_reply", label: "Announcement Replies", desc: "Someone comments on your announcement", icon: Bell, email: false, inApp: true, push: false },
  { id: "weekly_digest", label: "Weekly Digest", desc: "Summary of week's activity every Monday", icon: BarChart, email: true, inApp: false, push: false },
];

export function NotificationsTab() {
  const [muteAll, setMuteAll] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = useState(false);

  const togglePref = (id: string, channel: "email" | "inApp" | "push") => {
    setPrefs(current => 
      current.map(p => p.id === id ? { ...p, [channel]: !p[channel] } : p)
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Notification preferences saved successfully!");
    }, 800);
  };

  const hasChanges = JSON.stringify(prefs) !== JSON.stringify(DEFAULT_PREFS);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Notification Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Control how and when you receive alerts from the platform.
        </p>
      </div>

      <div className="rounded-lg border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/20">
        <div className="flex gap-3">
          <div className={`p-2 rounded-full ${muteAll ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"} flex-shrink-0`}>
            {muteAll ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Mute All Notifications</h4>
            <p className="text-sm text-muted-foreground">Temporarily pause all incoming alerts across all channels.</p>
          </div>
        </div>
        <Switch checked={muteAll} onCheckedChange={setMuteAll} aria-label="Mute all notifications" />
      </div>

      {muteAll && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md text-sm font-medium flex gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          All notifications are muted. You won't receive any alerts until you unmute.
        </div>
      )}

      <div className={`space-y-1 transition-opacity duration-300 ${muteAll ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div>Notification Event</div>
          <div className="flex justify-end gap-8 pr-2">
            <span className="w-12 text-center">Email</span>
            <span className="w-12 text-center">In-App</span>
            <span className="w-12 text-center">Push</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {prefs.map(p => (
            <div key={p.id} className="py-4 px-2 sm:px-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-muted/10 transition-colors rounded-lg">
              <div className="flex gap-3 items-start flex-1">
                <p.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-sm text-foreground">{p.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between xl:justify-end gap-6 sm:gap-8 ml-8 xl:ml-0 mt-3 xl:mt-0">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] sm:hidden uppercase font-semibold text-muted-foreground">Email</span>
                  <Switch checked={p.email} onCheckedChange={() => togglePref(p.id, "email")} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] sm:hidden uppercase font-semibold text-muted-foreground">In-App</span>
                  <Switch checked={p.inApp} onCheckedChange={() => togglePref(p.id, "inApp")} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] sm:hidden uppercase font-semibold text-muted-foreground">Push</span>
                  <Switch checked={p.push} onCheckedChange={() => togglePref(p.id, "push")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || (muteAll === false && !hasChanges)} className="min-w-[140px]">
          {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
        </Button>
      </div>
    </div>
  );
}
