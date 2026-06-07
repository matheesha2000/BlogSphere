'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { NotificationProvider } from '@/components/providers/NotificationProvider'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute =
    pathname?.startsWith('/auth') ||
    pathname === '/login' ||
    pathname === '/signup'

  if (isAuthRoute) {
    return (
      <NotificationProvider>
        <div className="min-h-screen w-full flex bg-gray-950">
          <main className="flex-1 flex items-center justify-center">
            {children}
          </main>
        </div>
      </NotificationProvider>
    )
  }

  return (
    <NotificationProvider>
      <div className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NotificationProvider>
  )
}
