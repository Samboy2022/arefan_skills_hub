"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4 z-50">
          <Link href="/features" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Features</Link>
          <Link href="/pricing" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/integrations" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Integrations</Link>
          <Link href="/documentation" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Docs</Link>
          <Link href="/about" className="text-lg font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>About</Link>
          <hr className="border-border" />
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button className="w-full justify-center">Get Started / Log In</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
