'use client'

import Link from 'next/link'
import PostContent from './PostContent'

interface PremiumGateProps {
  content: string
}

export default function PremiumGate({ content }: PremiumGateProps) {
  // Show only the first ~300 chars as a teaser
  const preview = content.substring(0, 300)

  return (
    <div>
      {/* Blurred preview */}
      <div className="relative">
        <div className="pointer-events-none select-none">
          <PostContent content={preview} />
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* CTA card */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="text-3xl mb-3">★</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          This is a premium article
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Subscribe to unlock this article and all future premium content for just $10/month.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/subscribe"
            className="bg-gray-900 !text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Subscribe — $10/month
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-300 !text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Log in if subscribed
          </Link>
        </div>
      </div>
    </div>
  )
}