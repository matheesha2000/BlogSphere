import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

/** Safely extract current_period_end — newer Stripe API versions may not expose it at the top level */
function safeCurrentPeriodEnd(sub: Stripe.Subscription): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (sub as any).current_period_end
  if (typeof raw === 'number' && raw > 0) {
    return new Date(raw * 1000).toISOString()
  }
  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
}

export const metadata = { title: 'Subscribed! — BlogApp' }

// Service-role Supabase client (bypasses RLS)
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SubscribeSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    return <ErrorUI message="No session ID found. Please contact support." />
  }

  let errorMessage: string | null = null

  try {
    // 1. Retrieve the completed checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription'],
    })

    if (session.payment_status !== 'paid') {
      errorMessage = 'Payment not completed. Please try again.'
    } else {
      const userId = session.metadata?.user_id
      const sub = session.subscription as Stripe.Subscription

      if (!userId || !sub) {
        errorMessage = 'Missing subscription data. Please contact support.'
      } else {
        // 2. Write to Supabase directly — no webhook needed
        const supabase = serviceClient()
        const { error } = await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: sub.id,
            status: sub.status,
            price_id: sub.items.data[0]?.price.id,
            current_period_end: safeCurrentPeriodEnd(sub),
          },
          { onConflict: 'user_id' }
        )

        if (error) {
          console.error('[Success Page] ❌ Supabase upsert failed:', error)
          errorMessage = `Database error: ${error.message}`
        } else {
          console.log('[Success Page] ✅ Subscription activated for user:', userId)
        }
      }
    }
  } catch (err) {
    console.error('[Success Page] ❌ Stripe error:', err)
    errorMessage = 'Could not verify your payment. Please contact support.'
  }

  if (errorMessage) {
    return <ErrorUI message={errorMessage} />
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re all set!</h1>
      <p className="text-gray-500 mb-8">
        Your subscription is now active. Enjoy unlimited access to all premium content.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/posts"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Browse posts
        </Link>
        <Link
          href="/dashboard"
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

function ErrorUI({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-500 mb-8">{message}</p>
      <Link
        href="/subscribe"
        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Back to subscribe
      </Link>
    </div>
  )
}