'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Settings as SettingsIcon,
  Eye,
  CheckCheck,
  AlertCircle,
  CreditCard,
  UserPlus,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

type NotificationItem = {
  id: string
  title: string
  message: string
  time: string
  href: string
  icon: 'billing' | 'user' | 'alert'
  read: boolean
}

export function AdminNavbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Payment Received',
      message: 'Lincoln High School payment of $999 was completed.',
      time: '2m ago',
      href: '/super-admin/transactions',
      icon: 'billing',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'New Tenant Onboarded',
      message: 'Tech Academy tenant profile was created successfully.',
      time: '18m ago',
      href: '/super-admin/tenants',
      icon: 'user',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Past Due Subscription',
      message: 'One subscription moved to past-due and needs review.',
      time: '1h ago',
      href: '/super-admin/billing',
      icon: 'alert',
      read: true,
    },
  ])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const getNotificationIcon = (type: NotificationItem['icon']) => {
    if (type === 'billing') {
      return <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    }
    if (type === 'user') {
      return <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    }
    return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants, users, courses..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="h-9 w-9 rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          onClick={() => setIsNotificationsOpen(true)}
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              <span className="sr-only">{unreadCount} unread notifications</span>
            </>
          ) : null}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-9 w-9 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>Super Admin</span>
              <span className="text-xs font-normal text-muted-foreground">admin@platform.com</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </header>

      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-[420px] p-0 sm:max-w-[420px]">
          <SheetHeader className="border-b px-5 py-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SheetTitle className="text-lg">Notifications</SheetTitle>
                <SheetDescription>Recent platform activity and events.</SheetDescription>
              </div>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </div>
            <div className="pt-3">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </SheetHeader>

          <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-4">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-muted p-1.5">
                      {getNotificationIcon(notification.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Link href={notification.href}>
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                        {!notification.read ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
