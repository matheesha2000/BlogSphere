'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUserhook/useUser'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { user, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-gray-900">
          BlogSphere
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/posts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Posts
          </Link>
          <Link href="/subscribe" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Premium
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/posts" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Posts</Link>
          <Link href="/subscribe" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Premium</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleSignOut} className="block text-sm text-gray-500 w-full text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/signup" className="block text-sm text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}