import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-none border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,border-color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'hover:border-muted-foreground/40 dark:hover:border-muted-foreground/50 disabled:hover:border-input',
        'read-only:bg-muted/50 read-only:text-muted-foreground read-only:hover:border-input read-only:focus-visible:ring-0 read-only:focus-visible:border-input',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-red-400/70 dark:aria-invalid:focus-visible:border-red-400/70 dark:aria-invalid:ring-red-400/25',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
