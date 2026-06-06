'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUserhook/useUser'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { label: 'Articles', href: '/posts' },
  { label: 'Premium', href: '/subscribe' },
]

export default function Navbar() {
  const { user, loading } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Add backdrop blur + border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-gray-950'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
              B
            </span>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-gray-200 transition-colors">
              BlogSphere
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden sm:flex items-center gap-1 text-gray-200">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop auth ── */}
          <div className="hidden sm:flex items-center gap-3 text-gray-200">
            {!loading && (
              user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive('/dashboard')
                        ? 'text-white bg-white/10'
                        : 'text-gray-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Dashboard
                  </Link>

                  {/* Avatar + sign-out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-colors duration-150"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* ── Mobile menu panel ── */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-white/10 bg-gray-950 px-5 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10 space-y-1 mt-2">
              {!loading && (
                user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all"
                    >
                      Sign up
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}