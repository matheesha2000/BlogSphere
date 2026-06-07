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

      <div className="relative z-10 w-full max-w-md text-center animate-fade-up">
        {/* Glassmorphic card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">You&apos;re all set!</h1>
          <p className="text-gray-300 mb-8">
            Your subscription is now active. Enjoy unlimited access to all premium content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/posts"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Browse posts
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-white/10 bg-white/5 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorUI({ message }: { message: string }) {
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

      <div className="relative z-10 w-full max-w-md text-center animate-fade-up">
        {/* Glassmorphic card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-8">{message}</p>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-4"
          >
            Back to subscribe
          </Link>
        </div>
      </div>
    </div>
  )
}