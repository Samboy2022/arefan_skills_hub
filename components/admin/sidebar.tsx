'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems, getNavSections } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebar } from './sidebar-context'

export function Sidebar() {
  const { isCollapsed } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
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
          'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-28' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-4 shrink-0 transition-all duration-300">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-full">
              <img src="/arefanskillshub2_black.png" alt="Arefan Skills Hub Logo" className="h-8 w-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center shrink-0">
                <img src="/arefanskillshub2_black.png" alt="Arefan Skills Hub Logo" className="h-10 w-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 pb-4">
              {sections.map(([section, items]) => (
                <div key={section}>
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
                                    'relative flex flex-col items-center justify-center gap-1 h-14 transition-all duration-200 px-0.5',
                                    isActive
                                      ? 'bg-brand/10 text-brand'
                                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                  )}
                                >
                                  <div className="relative">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <span className="text-[9px] font-medium text-center leading-tight line-clamp-2 px-1 break-words">
                                    {item.title}
                                  </span>
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
                              'flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative',
                              isActive
                                ? 'bg-brand/10 text-brand'
                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            )}
                          >
                            <div className="relative">
                              <Icon className="h-5 w-5 flex-shrink-0" />
                            </div>
                            <span className="text-sm font-medium flex-1">{item.title}</span>
                            {item.badge && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-semibold",
                                isActive 
                                  ? "bg-brand/15 text-brand" 
                                  : "bg-brand/10 text-brand"
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
      </aside>
    </TooltipProvider>
  )
}
