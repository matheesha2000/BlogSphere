'use client'
// FILE: components/auth/LoginForm.tsx
// Client Component - handles form state, calls Supabase auth, redirects on success

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  // Form field state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // UI state
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)   // toggle password visibility

  const router   = useRouter()
  const supabase = createClient()

  // ─── Submit handler ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Show Supabase error message (e.g. "Invalid login credentials")
      setError(error.message)
      setLoading(false)
      return
    }

    // Success — redirect to dashboard and refresh server cache
    router.push('/dashboard')
    router.refresh()
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="off"
          className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm
                     text-white placeholder-gray-500 bg-white/5
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                     transition-all duration-200"
        />
      </div>

      {/* Password field with show/hide toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          {/* Forgot password link */}
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className="w-full border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm
                       text-white placeholder-gray-500 bg-white/5
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       transition-all duration-200"
          />
          {/* Show / hide password button */}
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? (
              // Eye-off (slash) icon — password is visible, click to hide
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.228 6.228A10.45 10.45 0 002.458 12C3.732 16.057 7.523 19 12 19c1.652 0 3.208-.42 4.573-1.155M9.878 9.878A3 3 0 0012 9a3 3 0 012.828 2M15 12a3 3 0 01-3 3 3 3 0 01-.878-.134M17.772 17.772A10.45 10.45 0 0021.542 12C20.268 7.943 16.477 5 12 5c-1.374 0-2.685.27-3.888.757"
                />
              </svg>
            ) : (
              // Eye icon — password is hidden, click to show
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20
                        text-red-400 text-sm px-4 py-3 rounded-xl animate-fade-up">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-xl text-sm font-semibold
                   shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0
                   flex items-center justify-center gap-2 mt-4"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

    </form>
  )
}