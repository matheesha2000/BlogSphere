// FILE: app/(auth)/login/page.tsx
// Server Component

import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = { title: 'Log in — BlogSphere' }

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="animate-blob absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 animate-grid-scroll"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo + subtitle */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              B
            </span>
            <span className="text-2xl font-bold text-white tracking-tight">
              Welcome back
            </span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue to BlogSphere</p>
        </div>

        {/* Glassmorphic card */}
        <div className="bg-gray-900/50 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10">
          <LoginForm />

          {/* Switch to signup */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}