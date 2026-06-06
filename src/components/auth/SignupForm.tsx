'use client'
// FILE: components/auth/SignupForm.tsx
// Client Component - handles sign up via Supabase, shows email confirmation state

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupForm() {
  // Form fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // UI state
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)
  // removed email confirmation success UI; redirect immediately after signup

  const router   = useRouter()
  const supabase = createClient()

  // ─── Password strength indicator ─────────────────────────
  const getStrength = (pw: string) => {
    if (pw.length === 0) return 0
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score  // 0-4
  }

  const strength = getStrength(password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][strength]

  // ─── Submit handler ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPw) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirect to dashboard regardless; if the server requires email confirmation
    // the dashboard should handle unauthenticated users and redirect back to login.
    router.push('/dashboard')
    router.refresh()
    return
  }

  // ─── Signup form ──────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Full name */}
      <div>
        <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Full name <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Smith"
          autoComplete="name"
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                     text-gray-900 placeholder-gray-400 bg-white
                     focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                     transition-shadow"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                     text-gray-900 placeholder-gray-400 bg-white
                     focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                     transition-shadow"
        />
      </div>

      {/* Password + strength bar */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm
                       text-gray-900 placeholder-gray-400 bg-white
                       focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                       transition-shadow"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
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

        {/* Strength bar — only shown when user starts typing */}
        {password.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${
              strength <= 1 ? 'text-red-500' :
              strength === 2 ? 'text-amber-500' :
              strength === 3 ? 'text-blue-500' : 'text-green-600'
            }`}>
              {strengthLabel}
            </p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type={showPw ? 'text' : 'password'}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Repeat your password"
          required
          autoComplete="new-password"
          className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                      transition-shadow ${
                        confirmPw && confirmPw !== password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'
                      }`}
        />
        {confirmPw && confirmPw !== password && (
          <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match</p>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200
                        text-red-700 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium
                   hover:bg-gray-700 active:bg-gray-800
                   transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      {/* Terms note */}
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        By signing up you agree to our terms of service and privacy policy.
      </p>

    </form>
  )
}