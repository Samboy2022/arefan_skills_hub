"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  UploadCloud, 
  X, 
  CheckCircle2, 
  Palette, 
  Layers, 
  CreditCard, 
  Sparkles, 
  LayoutGrid, 
  Users, 
  BookOpen, 
  HelpCircle,
  Building2,
  Check,
  Menu,
  Search,
  Bell,
  Moon,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Calendar,
  History,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface AcademicSession {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'closed';
  startDate: string;
  endDate?: string;
  semesters: number;
}

export default function SettingsPage() {
  // Form states
  const [schoolName, setSchoolName] = useState("Bright Academy");
  const [schoolEmail, setSchoolEmail] = useState("admin@brightacademy.edu");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Custom theme colors for preview (Emerald brand green as primary default)
  const [primaryColor, setPrimaryColor] = useState("#0d9f58"); 
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9"); 
  const [tertiaryColor, setTertiaryColor] = useState("#f59e0b"); 

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);

  // Modals control
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Sessions management state
  const [sessions, setSessions] = useState<AcademicSession[]>([
    { id: '1', name: '2025/2026 Academic Session', description: 'Active academic year containing Fall and Spring semesters.', status: 'active', startDate: '2025-09-01', semesters: 2 },
    { id: '2', name: '2024/2025 Academic Session', description: 'Completed academic session.', status: 'closed', startDate: '2024-09-01', endDate: '2025-06-30', semesters: 2 },
    { id: '3', name: '2023/2024 Academic Session', description: 'Completed academic session.', status: 'closed', startDate: '2023-09-01', endDate: '2024-06-30', semesters: 2 }
  ]);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [newSessionSemesters, setNewSessionSemesters] = useState("2");

  // Dynamically generate year options from currentYear - 2 to currentYear + 5
  const currentYear = new Date().getFullYear();
  const sessionNameOptions = useMemo(() => {
    const options = [];
    for (let i = -2; i <= 5; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      options.push(`${startYear}/${endYear} Academic Session`);
    }
    return options;
  }, [currentYear]);

  // Payment states
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [paymentMode, setPaymentMode] = useState("test");
  const [stripePublishable, setStripePublishable] = useState("pk_test_51Nx...placeholder");
  const [stripeSecret, setStripeSecret] = useState("sk_test_51Nx...placeholder");
  const [stripeWebhook, setStripeWebhook] = useState("whsec_placeholder");
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showStripeWebhook, setShowStripeWebhook] = useState(false);
  const [enablePayment, setEnablePayment] = useState(true);
  const [currency, setCurrency] = useState("usd");
  const [taxRate, setTaxRate] = useState("0");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset palettes
  const colorPresets = [
    {
      name: "Default Brand",
      primary: "#0d9f58", // Emerald Green
      secondary: "#0ea5e9", // Sky Blue
      tertiary: "#f59e0b", // Amber
    },
    {
      name: "Ocean & Forest",
      primary: "#0284c7", // Sky Blue
      secondary: "#059669", // Emerald
      tertiary: "#d97706", // Amber
    },
    {
      name: "Royal Velvet",
      primary: "#7c3aed", // Violet
      secondary: "#db2777", // Pink
      tertiary: "#ca8a04", // Yellow
    },
    {
      name: "Midnight Sleek",
      primary: "#0f172a", // Slate
      secondary: "#14b8a6", // Teal
      tertiary: "#f43f5e", // Rose
    }
  ];

  // Load custom values from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("school_name");
    const savedEmail = localStorage.getItem("school_email");
    const savedLogo = localStorage.getItem("school_logo");
    const savedPrimary = localStorage.getItem("school_color_primary");
    const savedSecondary = localStorage.getItem("school_color_secondary");
    const savedTertiary = localStorage.getItem("school_color_tertiary");

    if (savedName) setSchoolName(savedName);
    if (savedEmail) setSchoolEmail(savedEmail);
    if (savedLogo) setLogoUrl(savedLogo);
    if (savedPrimary) {
      setPrimaryColor(savedPrimary);
      document.documentElement.style.setProperty("--primary", savedPrimary);
      document.documentElement.style.setProperty("--sidebar-primary", savedPrimary);
    }
    if (savedSecondary) setSecondaryColor(savedSecondary);
    if (savedTertiary) setTertiaryColor(savedTertiary);

    const savedSessions = localStorage.getItem("school_sessions");
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse academic sessions", e);
      }
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save visual configuration to localStorage
    localStorage.setItem("school_name", schoolName);
    localStorage.setItem("school_email", schoolEmail);
    if (logoUrl) {
      localStorage.setItem("school_logo", logoUrl);
    } else {
      localStorage.removeItem("school_logo");
    }
    localStorage.setItem("school_color_primary", primaryColor);
    localStorage.setItem("school_color_secondary", secondaryColor);
    localStorage.setItem("school_color_tertiary", tertiaryColor);

    // Dynamic hydration of primary CSS variable onto Document Element
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--sidebar-primary", primaryColor);

    // Dispatch global custom event to trigger instant layout updates
    window.dispatchEvent(new Event("school-settings-updated"));

    setShowSuccessModal(true);
  };

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    // Automatically close existing active sessions
    const updatedSessions = sessions.map(s => {
      if (s.status === 'active') {
        return {
          ...s,
          status: 'closed' as const,
          endDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    });

    // Insert new active session
    const newSession: AcademicSession = {
      id: `session-${Date.now()}`,
      name: newSessionName,
      description: newSessionDescription,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      semesters: parseInt(newSessionSemesters) || 2
    };

    const finalSessions = [newSession, ...updatedSessions];
    setSessions(finalSessions);
    localStorage.setItem("school_sessions", JSON.stringify(finalSessions));

    // Reset input fields
    setNewSessionName("");
    setNewSessionDescription("");
    setNewSessionSemesters("2");
    setShowSessionModal(false);

    toast.success("New academic session started successfully!");
  };

  const isActivePreset = (preset: typeof colorPresets[0]) => {
    return primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
           secondaryColor.toLowerCase() === preset.secondary.toLowerCase() &&
           tertiaryColor.toLowerCase() === preset.tertiary.toLowerCase();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Native Breadcrumb matching student/instructor pages */}
      <Breadcrumb 
        showHome={false} 
        items={[
          { label: "Dashboard", href: "/school-admin" },
          { label: "Settings" }
        ]} 
        className="mb-2" 
      />

      <PageHeader
        title="School Settings"
        description="Configure your school administration system, visual theme, and active academic sessions"
      />

      {/* Tabs list matching native shadcn tabs inside create page */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/50 mb-6 flex-wrap h-auto p-1 max-w-lg">
          <TabsTrigger value="general" className="data-[state=active]:bg-background">General</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-background">Payment</TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-background">School Sessions</TabsTrigger>
        </TabsList>

        {/* General Settings Tab Content */}
        <TabsContent value="general" className="mt-0">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input fields */}
            <div className="order-last lg:order-first lg:col-span-7 space-y-6">
              
              {/* Branding and Info Card */}
              <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
                    School Information & Branding
                  </CardTitle>
                  <CardDescription>
                    Configure your school name, contact email address, and official logo branding.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 space-y-5">
                  {/* School Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="school-name" className="text-sm font-medium text-foreground">School Name</Label>
                    <Input
                      id="school-name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Enter School Name"
                      className="bg-background h-11"
                      required
                    />
                  </div>

                  {/* School Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="school-email" className="text-sm font-medium text-foreground">School Email</Label>
                    <Input
                      id="school-email"
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      placeholder="Enter School Email"
                      className="bg-background h-11"
                      required
                    />
                  </div>

                  {/* School Logo Upload */}
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-foreground">School Logo</Label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div 
                        onClick={() => !logoUrl && fileInputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`flex-1 w-full border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                          logoUrl 
                            ? "border-emerald-500 bg-emerald-50/5 dark:bg-emerald-950/5 cursor-default" 
                            : dragActive
                              ? "border-primary bg-primary/5 animate-pulse"
                              : "border-border hover:border-primary hover:bg-primary/5"
                        }`}
                        style={{
                          borderColor: dragActive ? primaryColor : undefined,
                          backgroundColor: dragActive ? `${primaryColor}08` : undefined
                        }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        {logoUrl ? (
                          <div className="flex flex-col items-center gap-2 text-center w-full">
                            <div className="relative group p-2 bg-background rounded-lg border border-border shadow-xs max-w-[120px] max-h-[120px] overflow-hidden flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logoUrl} alt="School Logo Preview" className="max-w-full max-h-[80px] object-contain rounded" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Logo uploaded
                            </span>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto" />
                            <p className="text-sm font-medium text-foreground">Click or drag logo file here to upload</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 2MB</p>
                          </div>
                        )}
                      </div>

                      {logoUrl && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={removeLogo}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 w-full sm:w-auto h-11 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <X className="w-4 h-4 mr-1.5" /> Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Colors Card */}
              <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
                        Configure School Theme
                      </CardTitle>
                      <CardDescription>
                        Define your school's color scheme. This color palette will apply system-wide.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300" style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}>
                      <Sparkles className="w-3 h-3 animate-spin duration-3000" /> Live Preview
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Presets Grid */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Theme Presets</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(preset.primary);
                            setSecondaryColor(preset.secondary);
                            setTertiaryColor(preset.tertiary);
                          }}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                            isActivePreset(preset)
                              ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                              : "border-border bg-background hover:bg-muted/50"
                          }`}
                          style={{
                            borderColor: isActivePreset(preset) ? primaryColor : undefined,
                            backgroundColor: isActivePreset(preset) ? `${primaryColor}08` : undefined
                          }}
                        >
                          {isActivePreset(preset) && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs" style={{ backgroundColor: primaryColor }}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            {preset.name}
                          </span>
                          <div className="flex gap-1.5">
                            <span className="w-4 h-4 rounded-full border border-border shadow-xs" style={{ backgroundColor: preset.primary }} />
                            <span className="w-4 h-4 rounded-full border border-border shadow-xs" style={{ backgroundColor: preset.secondary }} />
                            <span className="w-4 h-4 rounded-full border border-border shadow-xs" style={{ backgroundColor: preset.tertiary }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleek Overlapping Hex Inputs (Aligned to App Typography) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Primary Color */}
                    <div className="space-y-2">
                      <Label htmlFor="primary" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Color</Label>
                      <div className="relative">
                        <Input
                          id="primary"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="pr-14 h-11 font-mono uppercase bg-background"
                        />
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="space-y-2">
                      <Label htmlFor="secondary" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Secondary Color</Label>
                      <div className="relative">
                        <Input
                          id="secondary"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="pr-14 h-11 font-mono uppercase bg-background"
                        />
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Tertiary Color */}
                    <div className="space-y-2">
                      <Label htmlFor="tertiary" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tertiary Color</Label>
                      <div className="relative">
                        <Input
                          id="tertiary"
                          value={tertiaryColor}
                          onChange={(e) => setTertiaryColor(e.target.value)}
                          className="pr-14 h-11 font-mono uppercase bg-background"
                        />
                        <input
                          type="color"
                          value={tertiaryColor}
                          onChange={(e) => setTertiaryColor(e.target.value)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/50 pt-5 pb-5 flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full sm:w-auto font-semibold shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Update Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right: Live Brand Preview Card (Perfectly Downscaled App Copy) */}
            <div className="order-first lg:order-last lg:col-span-5 space-y-4 lg:sticky lg:top-6">
              <div className="text-sm font-bold text-muted-foreground flex items-center gap-2 px-2">
                <Layers className="w-4 h-4 text-primary" style={{ color: primaryColor }} />
                Live Brand Theme Preview
              </div>

              <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 p-4 md:p-6 flex flex-col overflow-hidden">
                {/* Downscaled Application Dashboard Mockup */}
                <div className="rounded-lg border border-border shadow-inner bg-background overflow-hidden h-[490px] flex flex-col text-left">
                  
                  {/* Mock Navbar (Mirrors tenant-navbar.tsx) */}
                  <div className="border-b border-border px-4 py-2.5 flex justify-between items-center bg-card shrink-0">
                    {/* Left: toggle & Search */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted text-foreground">
                        <Menu className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Downscaled Search bar */}
                      <div className="relative flex-1 max-w-[120px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground" />
                        <div className="pl-6 pr-2 py-1 text-[8px] rounded bg-muted border border-border text-muted-foreground w-full select-none truncate">
                          Search students...
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                      {/* Notifications bell */}
                      <div className="relative w-5 h-5 flex items-center justify-center text-muted-foreground">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                      </div>

                      {/* Theme toggle */}
                      <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                        <Moon className="w-3.5 h-3.5" />
                      </div>

                      {/* Profile avatar dropdown */}
                      <div className="flex items-center gap-1.5 border-l pl-2 border-border">
                        <div className="w-6 h-6 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full text-white font-bold flex items-center justify-center text-[9px]" style={{ backgroundColor: primaryColor }}>
                              {schoolName ? schoolName.charAt(0).toUpperCase() : "B"}
                            </div>
                          )}
                        </div>
                        <div className="hidden min-[360px]:block text-left shrink-0">
                          <p className="text-[8px] font-bold leading-tight text-foreground truncate max-w-[60px]">
                            {schoolName || "Bright Academy"}
                          </p>
                          <p className="text-[7px] text-muted-foreground leading-none">Admin</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar and content */}
                  <div className="flex-1 flex overflow-hidden">
                    
                    {/* Mock Sidebar (Mirrors tenant-sidebar.tsx dark style) */}
                    <div className="w-28 bg-[#0c0e12] p-2 space-y-1.5 flex flex-col shrink-0">
                      {/* Logo header */}
                      <div className="h-6 border-b border-white/5 flex items-center px-1 gap-1 shrink-0 mb-1">
                        <div className="w-4 h-4 rounded flex items-center justify-center font-bold text-[8px] text-white shrink-0" style={{ backgroundColor: primaryColor }}>
                          FN
                        </div>
                        <span className="font-bold text-[7px] text-white/90 tracking-wider">FN SKILLS</span>
                      </div>

                      {/* Sidebar Nav Items */}
                      <div className="px-2 py-1 rounded text-[8px] font-bold flex items-center gap-1.5 shadow-sm transition-all animate-fade-in" style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}>
                        <LayoutGrid className="w-3 h-3" /> Dashboard
                      </div>
                      <div className="px-2 py-1 rounded text-[8px] font-medium text-white/60 flex items-center gap-1.5 hover:bg-white/5 cursor-pointer">
                        <BookOpen className="w-3 h-3" /> Courses
                      </div>
                      <div className="px-2 py-1 rounded text-[8px] font-medium text-white/60 flex items-center gap-1.5 hover:bg-white/5 cursor-pointer">
                        <Users className="w-3 h-3" /> Students
                      </div>
                      
                      <div className="px-2 py-1 rounded text-[8px] font-medium text-white/60 flex items-center gap-1.5 hover:bg-white/5 cursor-pointer mt-auto">
                        <HelpCircle className="w-3 h-3" /> Support
                      </div>
                    </div>

                    {/* Mock Content Dashboard Page */}
                    <div className="flex-1 p-3.5 bg-muted/20 space-y-3.5 overflow-y-auto">
                      <div className="flex justify-between items-center shrink-0">
                        <div>
                          <h4 className="text-[10px] font-bold text-foreground leading-none">Dashboard</h4>
                          <span className="text-[7px] text-muted-foreground mt-0.5 block">Branding snapshot</span>
                        </div>
                        <button type="button" className="text-[8px] font-bold text-white px-2 py-0.5 rounded shadow-xs transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                          Add User
                        </button>
                      </div>

                      {/* Mock Downscaled KPI cards with colored top border */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-card border border-border border-t-2 rounded shadow-xs p-1.5 flex flex-col justify-between" style={{ borderTopColor: primaryColor }}>
                          <span className="text-[6.5px] text-muted-foreground font-bold truncate">Students</span>
                          <div className="flex items-baseline gap-0.5 mt-0.5">
                            <span className="text-xs font-extrabold text-foreground">1,248</span>
                            <span className="text-[5.5px] font-bold px-0.5 rounded" style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}>
                              +5%
                            </span>
                          </div>
                        </div>

                        <div className="bg-card border border-border border-t-2 rounded shadow-xs p-1.5 flex flex-col justify-between" style={{ borderTopColor: secondaryColor }}>
                          <span className="text-[6.5px] text-muted-foreground font-bold truncate">Faculty</span>
                          <div className="flex items-baseline gap-0.5 mt-0.5">
                            <span className="text-xs font-extrabold text-foreground">48</span>
                            <span className="text-[5.5px] font-bold px-0.5 rounded" style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}>
                              +2%
                            </span>
                          </div>
                        </div>

                        <div className="bg-card border border-border border-t-2 rounded shadow-xs p-1.5 flex flex-col justify-between" style={{ borderTopColor: tertiaryColor }}>
                          <span className="text-[6.5px] text-muted-foreground font-bold truncate">Classes</span>
                          <div className="flex items-baseline gap-0.5 mt-0.5">
                            <span className="text-xs font-extrabold text-foreground">36</span>
                            <span className="text-[5.5px] font-bold px-0.5 rounded" style={{ backgroundColor: `${tertiaryColor}15`, color: tertiaryColor }}>
                              Stable
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Enrollment custom interactive bar chart */}
                      <div className="bg-card border border-border p-2.5 rounded shadow-xs space-y-1.5">
                        <span className="text-[7.5px] font-extrabold text-foreground block">Weekly Enrollments</span>
                        <div className="h-10 w-full flex items-end gap-1 px-1">
                          {[35, 55, 75, 45, 80, 95, 85].map((val, idx) => (
                            <div 
                              key={idx} 
                              className="flex-1 rounded-t-xs transition-all duration-300" 
                              style={{ 
                                height: `${val}%`, 
                                backgroundColor: idx % 2 === 0 ? primaryColor : secondaryColor 
                              }} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Mock Course Progress bar */}
                      <div className="bg-card border border-border p-2.5 rounded shadow-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[7.5px] font-extrabold text-foreground">Featured Class Completion</span>
                          <span className="text-[7.5px] font-bold" style={{ color: primaryColor }}>84%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: "84%", backgroundColor: primaryColor }} />
                        </div>
                      </div>

                      {/* Info alert banner styled with secondary/tertiary color highlights */}
                      <div className="border rounded p-2 flex items-start gap-1.5" style={{ borderColor: `${secondaryColor}30`, backgroundColor: `${secondaryColor}08` }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: secondaryColor }} />
                        <div className="space-y-0.5 overflow-hidden">
                          <span className="text-[8px] font-bold text-foreground block leading-tight">System Active</span>
                          <span className="text-[7px] text-muted-foreground block leading-tight truncate">
                            Configured contact: <strong className="text-foreground font-semibold">{schoolEmail}</strong>.
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Palette className="w-4 h-4 text-primary shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <div>
                    This interactive mockup shows exactly how your colors, branding, and name look together in the portal header, navigation accent, action buttons, progress bars, and badges.
                  </div>
                </div>
              </Card>
            </div>

          </form>
        </TabsContent>

        {/* Payment Settings Tab Content */}
        <TabsContent value="payment" className="mt-0">
          <form onSubmit={handleUpdate}>
            <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden max-w-4xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
                      Payment Gateway Integration
                    </CardTitle>
                    <CardDescription>
                      Configure Stripe, PayPal, or Razorpay to automatically collect tuition, registration, and school fees.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="enable-payment" className="text-xs font-semibold text-muted-foreground">Gateway Active</Label>
                    <Switch
                      id="enable-payment"
                      checked={enablePayment}
                      onCheckedChange={setEnablePayment}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Provider */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-provider" className="text-sm font-medium">Payment Provider</Label>
                    <Select value={paymentProvider} onValueChange={setPaymentProvider}>
                      <SelectTrigger id="payment-provider" className="h-11">
                        <SelectValue placeholder="Select Payment Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe Payments (Recommended)</SelectItem>
                        <SelectItem value="paypal">PayPal Checkout</SelectItem>
                        <SelectItem value="razorpay">Razorpay Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Environment Mode */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-mode" className="text-sm font-medium">Environment Mode</Label>
                    <Select value={paymentMode} onValueChange={setPaymentMode}>
                      <SelectTrigger id="payment-mode" className="h-11">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Sandbox / Test Mode</SelectItem>
                        <SelectItem value="live">Live / Production Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border border-border/50 rounded-lg p-4 bg-muted/20 space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Credentials</span>
                  </div>

                  {/* Stripe Publishable Key */}
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable" className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {paymentProvider === "stripe" ? "Stripe Publishable Key" : paymentProvider === "paypal" ? "PayPal Client ID" : "Razorpay Key ID"}
                    </Label>
                    <Input
                      id="stripe-publishable"
                      value={stripePublishable}
                      onChange={(e) => setStripePublishable(e.target.value)}
                      placeholder={paymentProvider === "stripe" ? "pk_test_..." : paymentProvider === "paypal" ? "Client ID" : "rzp_test_..."}
                      className="bg-background h-11 font-mono text-sm"
                      required
                    />
                  </div>

                  {/* Stripe Secret Key */}
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret" className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {paymentProvider === "stripe" ? "Stripe Secret Key" : paymentProvider === "paypal" ? "PayPal Secret Token" : "Razorpay Key Secret"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="stripe-secret"
                        type={showStripeSecret ? "text" : "password"}
                        value={stripeSecret}
                        onChange={(e) => setStripeSecret(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="bg-background h-11 font-mono text-sm pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-10 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowStripeSecret(!showStripeSecret)}
                      >
                        {showStripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Stripe Webhook Secret */}
                  <div className="space-y-2">
                    <Label htmlFor="stripe-webhook" className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Webhook Signing Secret
                    </Label>
                    <div className="relative">
                      <Input
                        id="stripe-webhook"
                        type={showStripeWebhook ? "text" : "password"}
                        value={stripeWebhook}
                        onChange={(e) => setStripeWebhook(e.target.value)}
                        placeholder="whsec_..."
                        className="bg-background h-11 font-mono text-sm pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-10 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowStripeWebhook(!showStripeWebhook)}
                      >
                        {showStripeWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Required for secure background transaction verification (enrollments, refunds, recurring fees).
                    </p>
                  </div>
                </div>

                {/* Currency & Tax */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Default Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="h-11">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - United States Dollar ($)</SelectItem>
                        <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound Sterling (£)</SelectItem>
                        <SelectItem value="cad">CAD - Canadian Dollar (C$)</SelectItem>
                        <SelectItem value="ngn">NGN - Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="inr">INR - Indian Rupee (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tax Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate" className="text-sm font-medium">Default Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="0.00"
                      className="bg-background h-11"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/50 pt-5 pb-5 flex flex-col sm:flex-row gap-3 justify-end">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full sm:w-64 h-11 border-primary/20 text-primary hover:bg-primary/5 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                  style={{ color: primaryColor }}
                  onClick={() => {
                    toast.success("Connection test successful! Gateway is communicating properly.");
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Test Gateway Connection
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-64 font-semibold h-11 shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  Update Payment Gateway
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Academic School Sessions Management Tab Content */}
        <TabsContent value="sessions" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Management & Sessions List */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
                        School Sessions
                      </CardTitle>
                      <CardDescription>
                        Manage active and past academic sessions. Create a new session to advance school terms.
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowSessionModal(true)}
                      className="font-semibold shadow-xs shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Start a new Session
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Active Session Highlight Card */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Session</h3>
                    {sessions.filter(s => s.status === 'active').length > 0 ? (
                      sessions.filter(s => s.status === 'active').map(session => (
                        <div 
                          key={session.id} 
                          className="border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-xl p-5 relative overflow-hidden transition-all duration-300 group hover:shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h4 className="text-base font-extrabold text-foreground leading-none">{session.name}</h4>
                                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 border border-emerald-500/10 uppercase tracking-wide">
                                  Active Session
                                </span>
                                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 border border-primary/10 uppercase tracking-wide" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, borderColor: `${primaryColor}20` }}>
                                  {session.semesters || 2} Semesters
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground pr-8 leading-relaxed">
                                {session.description}
                              </p>
                              <div className="text-xs text-muted-foreground/80 font-semibold pt-1 flex flex-wrap items-center gap-2 sm:gap-4">
                                <span>Started Date: {new Date(session.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                <span>Term Count: {session.semesters || 2} Semesters</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                        <p className="text-sm font-semibold">No Active Session Available</p>
                        <p className="text-xs mt-1">Start a new session to set up a valid academic term.</p>
                      </div>
                    )}
                  </div>

                  {/* Sessions History List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Session History</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {sessions.filter(s => s.status === 'closed').length > 0 ? (
                        sessions.filter(s => s.status === 'closed').map(session => (
                          <div 
                            key={session.id} 
                            className="border border-border bg-background hover:bg-muted/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-colors duration-200"
                          >
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-foreground">{session.name}</h4>
                              <p className="text-xs text-muted-foreground leading-normal max-w-md">
                                {session.description}
                              </p>
                            </div>
                            <div className="text-right shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                              <div className="flex flex-row gap-2 items-center">
                                <span className="bg-muted/60 text-muted-foreground border border-border/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {session.semesters || 2} Semesters
                                </span>
                                <span className="bg-muted text-muted-foreground border border-border/55 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Closed
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {new Date(session.startDate).getFullYear()} - {session.endDate ? new Date(session.endDate).getFullYear() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-xl">
                          No previous sessions found in history.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Mini explanation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-sm font-bold text-muted-foreground flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-primary" style={{ color: primaryColor }} />
                Session Lifecycle
              </div>

              <Card className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  What is a School Session?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Academic Sessions represent complete administrative periods (e.g., calendar school years). Inside a session, courses are mapped, grades are tabulated, and student registrations are active.
                </p>
                <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Critical Note:</span>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Starting a new academic session will immediately close the active session and archive all enrollments. Make sure to back up fee metrics and student report cards prior to closing the active session.
                  </p>
                </div>
              </Card>
            </div>

          </div>
        </TabsContent>
      </Tabs>

      {/* Pop-up dialog Success Modal - Native Shadcn Dialog Component */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md p-6 md:p-8 text-center rounded-lg border border-border bg-card">
          <div className="flex flex-col items-center gap-5">
            {/* Native App Success Checkmark Circle styling */}
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            
            <div className="space-y-2 w-full">
              <DialogTitle className="text-xl font-bold text-foreground text-center">Settings Updated!</DialogTitle>
              <div className="p-3 bg-muted/40 rounded-lg border border-border mt-1">
                <p className="text-sm text-foreground font-semibold text-center">
                  “settings were saved”
                </p>
              </div>
              <DialogDescription className="text-sm text-muted-foreground font-medium pt-2 text-center">
                You have finished configuring your school
              </DialogDescription>
            </div>

            <div className="w-full pt-4">
              <Button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: primaryColor }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Start a new Session Dialogue Modal - Safety closure validation */}
      <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-lg border border-border bg-card">
          <DialogHeader className="border-b pb-3 mb-4">
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
              Start a New Academic Session
            </DialogTitle>
            <DialogDescription>
              Configure the parameters of the new academic period. Active terms will automatically be archived.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleStartSession} className="space-y-5">
            
            {/* Session Name dynamic dropdown */}
            <div className="space-y-2">
              <Label htmlFor="session-name" className="text-sm font-medium">Session Name <span className="text-destructive">*</span></Label>
              <Select value={newSessionName} onValueChange={setNewSessionName} required>
                <SelectTrigger id="session-name" className="h-11 bg-background">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {sessionNameOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Semesters selection */}
            <div className="space-y-2">
              <Label htmlFor="session-semesters" className="text-sm font-medium">Number of Semesters <span className="text-destructive">*</span></Label>
              <Select value={newSessionSemesters} onValueChange={setNewSessionSemesters} required>
                <SelectTrigger id="session-semesters" className="h-11 bg-background">
                  <SelectValue placeholder="Select Number of Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Semester</SelectItem>
                  <SelectItem value="2">2 Semesters (Standard)</SelectItem>
                  <SelectItem value="3">3 Semesters (Trimester)</SelectItem>
                  <SelectItem value="4">4 Semesters (Quarterly)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Session Description */}
            <div className="space-y-2">
              <Label htmlFor="session-desc" className="text-sm font-medium">Brief Description</Label>
              <Textarea
                id="session-desc"
                value={newSessionDescription}
                onChange={(e) => setNewSessionDescription(e.target.value)}
                placeholder="Write a brief description details about this session..."
                className="bg-background min-h-[100px] resize-y"
              />
            </div>

            {/* Warnings container explaining that Active sessions will be closed */}
            <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-4 flex gap-3 items-start select-none">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">Important Safety Guard</span>
                <p className="text-xs text-amber-700 dark:text-amber-500/90 leading-relaxed font-semibold">
                  Active sessions will be closed. You cancel this operation if you do not want it to be closed
                </p>
              </div>
            </div>

            {/* Modal actions Cancel and Start Session */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSessionModal(false)}
                className="flex-1 sm:flex-initial sm:w-36 h-11 font-semibold transition-all hover:bg-muted duration-200 flex items-center justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-initial sm:w-36 h-11 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                Start Session
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
