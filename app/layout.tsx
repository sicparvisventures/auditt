import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToastProvider } from '@/components/ui/Toaster'
import { BackgroundDecoration } from '@/components/ui/BackgroundDecoration'
import { TranslationProvider } from '@/lib/translation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AuditFlow',
  description: 'Interne audit tool voor district managers van Poule & Poulette filialen',
  manifest: '/manifest.json',
  icons: {
    icon: '/kipje.png',
    apple: '/kipje.png',
    shortcut: '/kipje.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AuditFlow',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1C3834',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className="h-full">
      <body className={`${inter.className} h-full bg-ppwhite`}>
        <TranslationProvider>
          <ToastProvider>
            <AuthProvider>
              <BackgroundDecoration />
              <div className="min-h-full relative z-10">
                {children}
              </div>
            </AuthProvider>
          </ToastProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
