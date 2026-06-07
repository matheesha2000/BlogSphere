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
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Go Premium</h1>
      <p className="text-gray-500 mb-12">
        Unlock all premium articles with a monthly subscription.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        {/* Price */}
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">$10</span>
          <span className="text-gray-500 text-lg">/month</span>
        </div>

        {/* Features */}
        <ul className="text-left space-y-3 mb-8">
          {[
            'Access to all premium articles',
            'New premium content every week',
            'Cancel anytime',
            'Support independent writing',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {isSubscribed ? (
          <div className="bg-green-50 text-green-700 rounded-lg p-4 text-sm font-medium">
            ✓ You already have an active subscription
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting to checkout…' : user ? 'Subscribe now' : 'Sign in to subscribe'}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Secure checkout powered by Stripe. Cancel anytime from your dashboard.
      </p>
    </div>
  )
}