import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Fnskills',
    default: 'Fnskills - Advanced Learning Management System',
  },
  description: 'A comprehensive platform for skills development, course management, and educational tracking. Empower your learning journey with Fnskills.',
  keywords: ['Fnskills', 'LMS', 'Learning Management System', 'Skills Development', 'Education', 'Online Courses'],
  authors: [{ name: 'Fnskills Team' }],
  metadataBase: new URL('https://fnskills.com'),
  openGraph: {
    title: 'Fnskills - Advanced Learning Management System',
    description: 'Empowering growth through skill-based learning and advanced education management solutions.',
    url: 'https://fnskills.com',
    siteName: 'Fnskills',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fnskills - Advanced Learning Management System',
    description: 'Empowering growth through skill-based learning and advanced education management solutions.',
  },
  icons: {
    icon: '/icon-dark-32x32.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextTopLoader color="oklch(0.61 0.19 149.213)" showSpinner={false} height={3} crawl={true} />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
