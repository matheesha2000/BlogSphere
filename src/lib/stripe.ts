import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(target, prop, receiver) {
    if (!stripeInstance) {
      const key = process.env.STRIPE_SECRET_KEY || 'dummy'
      stripeInstance = new Stripe(key, {
        apiVersion: '2026-05-27.dahlia',
      })
    }
    const value = Reflect.get(stripeInstance, prop, receiver)
    return typeof value === 'function' ? value.bind(stripeInstance) : value
  }
})