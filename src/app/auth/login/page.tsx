// FILE: app/(auth)/login/page.tsx
// This is a Server Component - no 'use client' needed
// It just renders the layout shell and imports the LoginForm

import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = { title: 'Log in — BlogSphere' }

export default function LoginPage() {
  return (
    // Outer wrapper - centered on screen (handled by (auth)/layout.tsx)
    <div className="w-full max-w-sm">

      {/* Logo + subtitle */}
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          BlogSphere
        </Link>
        <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
      </div>

      {/* White card containing the form */}
      <div className="bg-white rounded-xl border shadow-md border-gray-200 p-8">
        <LoginForm />

        {/* Switch to signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}