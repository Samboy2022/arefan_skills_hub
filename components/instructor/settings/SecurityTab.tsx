"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, Laptop, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { TwoFactorModal } from "./TwoFactorModal";

const MOCK_SESSIONS = [
  { id: "sess-7f82", device: "Chrome 124 on macOS", ip: "102.89.12.245", location: "Lagos, Nigeria", lastActive: "Just now", isCurrent: true },
  { id: "sess-3a11", device: "Safari on iPhone", ip: "197.210.45.102", location: "Abuja, Nigeria", lastActive: "2 days ago", isCurrent: false },
  { id: "sess-9q34", device: "Edge on Windows", ip: "104.28.19.11", location: "London, UK", lastActive: "Last week", isCurrent: false },
];

export function SecurityTab() {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const revokeSession = (id: string) => {
    setSessions(s => s.filter(x => x.id !== id));
  };

  const revokeAllOther = () => {
    setSessions(s => s.filter(x => x.isCurrent));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-muted-foreground" />
          Security Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Protect your account with advanced security controls and monitor active sessions.
        </p>
      </div>

      {/* Passwords & Authentication */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Password Card */}
          <div className="rounded-xl border border-border p-5 flex flex-col justify-between bg-card hover:bg-muted/10 transition-colors">
            <div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Password</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Password last changed: January 14, 2026.
              </p>
            </div>
            <Button variant="outline" className="w-fit" onClick={() => setPasswordModalOpen(true)}>
              Change Password
            </Button>
          </div>

          {/* 2FA Card */}
          <div className={`rounded-xl border p-5 flex flex-col justify-between transition-colors ${
            is2FAEnabled ? "bg-emerald-50/30 border-emerald-200" : "bg-card hover:bg-muted/10 border-border"
          }`}>
            <div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 border ${
                is2FAEnabled ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-600"
              }`}>
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                Two-Factor Auth
                {is2FAEnabled && <Badge className="bg-emerald-500 hover:bg-emerald-600 border-transparent text-white px-1.5 h-5 text-[10px] uppercase font-bold tracking-wider">Active</Badge>}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {is2FAEnabled 
                  ? "Your account is protected by an authenticator application."
                  : "Your account is not protected by 2FA. Enable it for extra security."}
              </p>
            </div>
            {is2FAEnabled ? (
              <div className="flex gap-2">
                <Button variant="outline" className="w-fit border-emerald-200 text-emerald-700 hover:bg-emerald-50">Manage 2FA</Button>
                <Button variant="ghost" onClick={() => setIs2FAEnabled(false)} className="w-fit text-red-500 hover:text-red-600 hover:bg-red-50">Disable</Button>
              </div>
            ) : (
              <Button className="w-fit" onClick={() => setTwoFactorModalOpen(true)}>
                Enable 2FA
              </Button>
            )}
          </div>

        </div>
      </section>

      {/* Active Sessions */}
      <section className="space-y-4 pt-2">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Active Sessions</h4>
        <div className="rounded-xl border bg-background overflow-hidden relative">
          <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_100px] gap-4 px-5 py-3 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
             <span>Device</span>
             <span>IP Address</span>
             <span>Location</span>
             <span>Last Active</span>
             <span className="text-right">Action</span>
          </div>
          <div className="divide-y divide-border">
            {sessions.map(s => (
              <div key={s.id} className="flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr_100px] gap-2 sm:gap-4 px-5 py-4 sm:py-3 items-start sm:items-center hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-md">
                    {s.device.includes("iPhone") ? <Smartphone className="h-4 w-4 text-slate-600" /> : <Laptop className="h-4 w-4 text-slate-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground flex items-center gap-2">
                      {s.device} 
                      {s.isCurrent && <Badge variant="outline" className="bg-brand/10 text-brand border-transparent py-0 h-4 px-1 text-[9px] uppercase font-bold tracking-widest">This Session</Badge>}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-mono text-muted-foreground">{s.ip}</div>
                <div className="text-sm text-muted-foreground">{s.location}</div>
                <div className="text-sm text-muted-foreground">{s.lastActive}</div>
                <div className="flex justify-end w-full sm:w-auto">
                  {!s.isCurrent && (
                    <Button variant="ghost" size="sm" onClick={() => revokeSession(s.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-7 gap-1.5">
                      <Trash2 className="h-3.5 w-3.5" /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No active sessions found.</div>
            )}
          </div>
        </div>
        {sessions.length > 1 && (
          <div className="flex justify-end">
            <button onClick={revokeAllOther} className="text-sm font-medium text-red-500 hover:text-red-600 underline underline-offset-2">
              Revoke all other sessions
            </button>
          </div>
        )}
      </section>

      {/* Danger Zone */}
      <section className="pt-8">
        <div className="border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 rounded-r-xl p-6 border border-b-border border-r-border border-t-border">
          <h4 className="text-base font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h4>
          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-5 max-w-2xl">
            Proceed with caution. These actions can interrupt your workflow or permanently erase data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button variant="destructive" className="gap-2 bg-red-600 hover:bg-red-700 border-transparent shadow-sm">
              <LogOut className="h-4 w-4" /> Log Out From Platform
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent">
              Request Account Deletion
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ChangePasswordModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
      <TwoFactorModal open={twoFactorModalOpen} onOpenChange={setTwoFactorModalOpen} onEnable={() => setIs2FAEnabled(true)} />
    </div>
  );
}
