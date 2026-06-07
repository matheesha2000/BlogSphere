'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUserhook/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const { user } = useUser()
  const { isSubscribed } = useSubscription()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login?redirectTo=/subscribe')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

      <div className="relative z-10 w-full max-w-lg text-center animate-fade-up">
        
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 mb-4 animate-pulse">
            ✦ Premium Membership
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Level up your reading
          </h1>
          <p className="text-gray-400 text-lg">
            Unlock exclusive articles, early access, and a better experience.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden group">
          {/* subtle hover glow inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            {/* Price */}
            <div className="mb-8 flex items-baseline justify-center">
              <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">$10</span>
              <span className="text-gray-400 text-xl ml-2">/month</span>
            </div>

            {/* Features */}
            <ul className="text-left space-y-4 mb-10 max-w-sm mx-auto">
              {[
                'Access to all premium articles',
                'New premium content every week',
                'Ad-free reading experience',
                'Cancel anytime from dashboard',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {isSubscribed ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 text-sm font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You are currently subscribed!
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl text-base font-bold
                           shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Redirecting to Stripe…
                  </>
                ) : user ? (
                  'Subscribe Now'
                ) : (
                  'Sign in to Subscribe'
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Secure checkout powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}