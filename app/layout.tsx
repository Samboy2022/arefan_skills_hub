import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Arefan Skills Hub',
    default: 'Arefan Skills Hub - Advanced Learning Management System',
  },
  description: 'A comprehensive platform for skills development, course management, and educational tracking. Empower your learning journey with Arefan Skills Hub.',
  keywords: ['Arefan Skills Hub', 'LMS', 'Learning Management System', 'Skills Development', 'Education', 'Online Courses'],
  authors: [{ name: 'Arefan Skills Hub Team' }],
  metadataBase: new URL('https://arefanskillshub.com'),
  openGraph: {
    title: 'Arefan Skills Hub - Advanced Learning Management System',
    description: 'Empowering growth through skill-based learning and advanced education management solutions.',
    url: 'https://arefanskillshub.com',
    siteName: 'Arefan Skills Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arefan Skills Hub - Advanced Learning Management System',
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
