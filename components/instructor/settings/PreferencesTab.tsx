"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Settings, Save, Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PreferencesTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Preferences saved successfully!");
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Settings & Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Localize your experience and set your default teaching parameters.
        </p>
      </div>

      {/* Localization */}
      <section className="space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Localization</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="zh">Mandarin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="Africa/Lagos">
              <SelectTrigger>
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <Label>Date Format</Label>
            <RadioGroup defaultValue="dd-mm-yyyy" className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm-dd-yyyy" id="df-1" />
                <Label htmlFor="df-1" className="font-normal cursor-pointer">MM/DD/YYYY</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd-mm-yyyy" id="df-2" />
                <Label htmlFor="df-2" className="font-normal cursor-pointer">DD/MM/YYYY</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yyyy-mm-dd" id="df-3" />
                <Label htmlFor="df-3" className="font-normal cursor-pointer">YYYY-MM-DD</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <Label>Time Format</Label>
            <RadioGroup defaultValue="12" className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="tf-1" />
                <Label htmlFor="tf-1" className="font-normal cursor-pointer">12-hour (AM/PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="tf-2" />
                <Label htmlFor="tf-2" className="font-normal cursor-pointer">24-hour</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Appearance</h4>
        
        <div className="space-y-3">
          <Label>Theme Selection</Label>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${theme === 'light' ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/20' : 'bg-background hover:bg-muted'}`}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/20' : 'bg-background hover:bg-muted'}`}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${theme === 'system' ? 'bg-primary/5 border-primary text-primary ring-2 ring-primary/20' : 'bg-background hover:bg-muted'}`}
            >
              <Monitor className="h-4 w-4" /> System
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Updates immediately. No save required.</p>
        </div>
      </section>

      {/* Teaching Defaults */}
      <section className="space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Teaching Defaults</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Default Assignment Duration</Label>
            <Select defaultValue="1w">
              <SelectTrigger>
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3d">3 days</SelectItem>
                <SelectItem value="1w">1 week</SelectItem>
                <SelectItem value="2w">2 weeks</SelectItem>
                <SelectItem value="1m">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Quiz Time Limit (mins)</Label>
            <Input type="number" defaultValue={30} min={5} max={180} />
          </div>

          <div className="space-y-2">
            <Label>Grade Scale</Label>
            <Select defaultValue="standard">
              <SelectTrigger>
                <SelectValue placeholder="Select Scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (A/B/C/D/F)</SelectItem>
                <SelectItem value="passfail">Pass/Fail</SelectItem>
                <SelectItem value="percentage">Percentage Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col justify-end pb-1.5">
            <div className="flex items-center gap-3">
              <Switch id="auto-publish" />
              <div className="flex flex-col">
                <Label htmlFor="auto-publish" className="cursor-pointer">Auto-publish Grades</Label>
                <span className="text-xs text-muted-foreground mt-0.5">Students see marks instantly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
          {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
        </Button>
      </div>
    </div>
  );
}
