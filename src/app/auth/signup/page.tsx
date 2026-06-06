// FILE: app/(auth)/signup/page.tsx
// Server Component - just a layout shell around SignupForm

import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export const metadata = { title: 'Sign up — BlogApp' }

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">

      {/* Logo + subtitle */}
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          BlogSphere
        </Link>
        <p className="text-gray-500 mt-2 text-sm">Create your account</p>
      </div>

      {/* White card */}
      <div className="bg-white rounded-xl border shadow-md border-gray-200 p-8">
        <SignupForm />

        {/* Switch to login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-900 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
