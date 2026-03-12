'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems, getNavSections } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sections = getNavSections()

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 border-b flex items-center justify-center px-4">
          {isCollapsed ? (
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-foreground">L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">LMS Platform</span>
                <span className="text-xs text-muted-foreground">Super Admin</span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-20 h-8 w-8 rounded-full border shadow-sm z-50 transition-all duration-300",
            isCollapsed ? "right-[-16px]" : "right-[-16px]"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-3 py-4">
            <nav className="space-y-6 pb-4">
              {sections.map(([section, items]) => (
                <div key={section}>
                  {!isCollapsed && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              <Link href={item.href}>
                                <div
                                  className={cn(
                                    'relative flex items-center justify-center h-11 rounded-lg transition-all duration-200',
                                    isActive
                                      ? 'bg-primary/10 text-primary shadow-sm'
                                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                  )}
                                >
                                  {isActive && (
                                    <div className="absolute right-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-l-full bg-white" />
                                  )}
                                  <Icon className="h-5 w-5" />
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-2">
                              <p className="font-medium">{item.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      }

                      return (
                        <Link key={item.href} href={item.href}>
                          <div
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                              isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            {isActive && (
                              <div className="absolute right-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-l-full bg-white" />
                            )}
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm font-medium flex-1">{item.title}</span>
                            {item.badge && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-semibold",
                                isActive 
                                  ? "bg-primary/15 text-primary" 
                                  : "bg-primary/10 text-primary"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>

        {/* Footer Info */}
        {!isCollapsed && (
          <div className="border-t p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Super Admin</p>
                <p className="text-xs text-muted-foreground">v0.1.0</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
