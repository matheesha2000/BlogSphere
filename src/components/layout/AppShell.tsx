'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute =
    pathname?.startsWith('/auth') ||
    pathname === '/login' ||
    pathname === '/signup'

  if (isAuthRoute) {
    return (
      <div className="min-h-full flex">
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
