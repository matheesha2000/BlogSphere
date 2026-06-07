import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

/** Safely extract current_period_end — newer Stripe API versions may not expose it at the top level */
function safeCurrentPeriodEnd(sub: Stripe.Subscription): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (sub as any).current_period_end
  if (typeof raw === 'number' && raw > 0) {
    return new Date(raw * 1000).toISOString()
  }
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
}

// Supabase service role client
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[Stripe Webhook] ❌ Invalid signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = serviceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const subscriptionId = session.subscription as string

    if (!userId || !subscriptionId) {
      console.error('[Stripe Webhook] ❌ Missing metadata:', { userId, subscriptionId })
      return NextResponse.json(
        { error: 'Missing metadata or subscription' },
        { status: 400 }
      )
    }

    // ✅ Force correct Stripe type
    const sub: Stripe.Subscription =
      await stripe.subscriptions.retrieve(subscriptionId)

    const { error: upsertError } = await supabase.from('subscriptions').upsert(
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

    if (upsertError) {
      console.error('[Stripe Webhook] ❌ Supabase upsert failed:', upsertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log('[Stripe Webhook] ✅ Subscription activated for user:', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription

    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_customer_id', sub.customer as string)
  }

  return NextResponse.json({ received: true })
}