"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RegistrationNav, RegistrationSidebar } from "@/components/registration/registration-sidebar";
import { RegistrationNavbar } from "@/components/registration/registration-navbar";
import { RegistrationCommandsProvider } from "@/components/registration/registration-commands";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function RegistrationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  function toggle() {
    if (window.matchMedia("(min-width: 768px)").matches) setCollapsed((value) => !value);
    else setMobileOpen(true);
  }

  return (
    <RegistrationCommandsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <RegistrationSidebar collapsed={collapsed} />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
            <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-4">
              <SheetTitle asChild>
                <Link href="/registration" className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fnskillslogo2.png" alt="Fnskills" className="h-8 w-auto" />
                  <span className="text-sm font-semibold">Registration</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100%-4rem)]">
              <RegistrationNav />
            </div>
          </SheetContent>
        </Sheet>
        <div className={cn("flex h-full min-w-0 flex-1 flex-col transition-all duration-300", collapsed ? "md:ml-28" : "md:ml-64")}>
          <RegistrationNavbar onToggle={toggle} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </RegistrationCommandsProvider>
  );
}
