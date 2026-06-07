'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUserhook/useUser'
import type Stripe from 'stripe'

// Define your DB subscription type instead of '@/types'
type SubscriptionRow = {
  id?: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: string
  price_id?: string
  current_period_end?: string
  created_at?: string
}

interface UseSubscriptionReturn {
  subscription: SubscriptionRow | null
  isSubscribed: boolean
  loading: boolean
  refetch: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, loading: userLoading } = useUser()

  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // ✅ Stable fetch function (NO user dependency → prevents loop)
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (error) {
      console.error('Subscription fetch error:', error.message)
      setSubscription(null)
    } else {
      setSubscription(data)
    }

    setLoading(false)
  }, [supabase, user?.id]) // ✅ stable dependency

  // ✅ Safe effect (runs only when auth finishes)
  useEffect(() => {
    if (userLoading) return
    // Avoid calling setState synchronously inside an effect (prevents eslint react-hooks/set-state-in-effect)
    const t = setTimeout(() => {
      void fetchSubscription()
    })

    return () => clearTimeout(t)
  }, [userLoading, fetchSubscription])

  // ✅ Real-time listener (safe)
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`subscription-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchSubscription, supabase])

  const isSubscribed = subscription?.status === 'active'

  return {
    subscription,
    isSubscribed,
    loading: userLoading || loading,
    refetch: fetchSubscription,
  }
}