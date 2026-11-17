"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Building2,
  Copy,
  CreditCard,
  FileText,
  Globe,
  Keyboard,
  LayoutDashboard,
  LifeBuoy,
  LogIn,
  MessageSquarePlus,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useCurrentApplication } from "@/components/registration/use-current-application";
import { subdomainHost } from "@/lib/school-registration";

export const REGISTRATION_PAGES = [
  { label: "Overview", href: "/registration", key: "o", icon: LayoutDashboard },
  { label: "School details", href: "/registration/school", key: "s", icon: Building2 },
  { label: "Plan", href: "/registration/plan", key: "p", icon: CreditCard },
  { label: "Documents", href: "/registration/documents", key: "d", icon: FileText },
  { label: "Custom domain", href: "/registration/domain", key: "c", icon: Globe },
  { label: "Support", href: "/registration/support", key: "h", icon: LifeBuoy },
] as const;

interface CommandsContextValue {
  openPalette: () => void;
  openShortcuts: () => void;
}

const CommandsContext = createContext<CommandsContextValue>({ openPalette: () => {}, openShortcuts: () => {} });

export function useRegistrationCommands() {
  return useContext(CommandsContext);
}

function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(
    element && (element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT" || element.isContentEditable),
  );
}

/**
 * Keyboard layer for the registration dashboard:
 * ⌘K / Ctrl+K palette, "g" then a letter to jump, "n" for a new ticket, "?" for the list.
 */
export function RegistrationCommandsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { application } = useCurrentApplication();
  const [palette, setPalette] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  // The dialogs are client-only: their hidden titles would otherwise server-render with mismatched ids.
  const [mounted, setMounted] = useState(false);
  const chord = useRef<number | null>(null);
  const active = application?.subdomainStatus === "active";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((open) => !open);
        return;
      }
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

      if (chord.current) {
        const page = REGISTRATION_PAGES.find((entry) => entry.key === event.key.toLowerCase());
        window.clearTimeout(chord.current);
        chord.current = null;
        if (page) {
          event.preventDefault();
          router.push(page.href);
        }
        return;
      }
      if (event.key === "g") {
        chord.current = window.setTimeout(() => {
          chord.current = null;
        }, 1200);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setShortcuts(true);
      } else if (event.key === "n") {
        event.preventDefault();
        router.push("/registration/support?new=1");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  function run(action: () => void) {
    setPalette(false);
    action();
  }

  function copySubdomain() {
    if (!application) return;
    const host = subdomainHost(application.subdomain);
    navigator.clipboard
      ?.writeText(`https://${host}`)
      .then(() => toast.success("Address copied", { description: host }))
      .catch(() => toast.error("Could not copy"));
  }

  return (
    <CommandsContext.Provider value={{ openPalette: () => setPalette(true), openShortcuts: () => setShortcuts(true) }}>
      {children}

      {mounted && (
        <>
          <CommandDialog open={palette} onOpenChange={setPalette} title="Jump to" description="Search pages and actions">
            <CommandInput placeholder="Type a page or an action…" />
            <CommandList>
              <CommandEmpty>Nothing matches that.</CommandEmpty>
              <CommandGroup heading="Go to">
                {REGISTRATION_PAGES.map((page) => (
                  <CommandItem key={page.href} value={page.label} onSelect={() => run(() => router.push(page.href))}>
                    <page.icon className="mr-2 h-4 w-4" />
                    {page.label}
                    <CommandShortcut>G {page.key.toUpperCase()}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem value="New support ticket" onSelect={() => run(() => router.push("/registration/support?new=1"))}>
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  New support ticket
                  <CommandShortcut>N</CommandShortcut>
                </CommandItem>
                {application && (
                  <CommandItem value="Copy school address subdomain" onSelect={() => run(copySubdomain)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy school address
                  </CommandItem>
                )}
                <CommandItem value="Toggle dark mode theme" onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}>
                  <Moon className="mr-2 h-4 w-4" />
                  Toggle dark mode
                </CommandItem>
                <CommandItem value="Keyboard shortcuts help" onSelect={() => run(() => setShortcuts(true))}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard shortcuts
                  <CommandShortcut>?</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              {active && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Sign in">
                    {[
                      { label: "School admin", href: "/login/school-admin" },
                      { label: "Instructor", href: "/login/instructor" },
                      { label: "Student", href: "/login/student" },
                    ].map((login) => (
                      <CommandItem key={login.href} value={`Sign in ${login.label}`} onSelect={() => run(() => router.push(login.href))}>
                        <LogIn className="mr-2 h-4 w-4" />
                        {login.label} login
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </CommandDialog>

          <Dialog open={shortcuts} onOpenChange={setShortcuts}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Keyboard shortcuts</DialogTitle>
                <DialogDescription>Work through registration without reaching for the mouse.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                <ShortcutGroup
                  title="Anywhere"
                  rows={[
                    ["Search pages and actions", ["⌘", "K"]],
                    ["New support ticket", ["N"]],
                    ["Show this list", ["?"]],
                  ]}
                />
                <ShortcutGroup
                  title="Go to"
                  rows={REGISTRATION_PAGES.map((page) => [page.label, ["G", page.key.toUpperCase()]] as [string, string[]])}
                />
                <ShortcutGroup
                  title="In forms"
                  rows={[
                    ["Save school details", ["⌘", "S"]],
                    ["Send a reply", ["⌘", "Enter"]],
                  ]}
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </CommandsContext.Provider>
  );
}

function ShortcutGroup({ title, rows }: { title: string; rows: [string, string[]][] }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="space-y-1.5">
        {rows.map(([label, keys]) => (
          <li key={label} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="flex items-center gap-1">
              {keys.map((key, index) => (
                <Kbd key={`${key}-${index}`} className="min-w-6 border border-border bg-muted px-1.5">
                  {key}
                </Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
