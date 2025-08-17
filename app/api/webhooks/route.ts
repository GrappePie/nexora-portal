import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { setSubscription } from '../../../lib/subscriptions'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return new Response('Stripe not configured', { status: 500 })
  }
  const stripe = new Stripe(secret)

  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId
    if (userId && planId) {
      setSubscription(Number(userId), planId)
    }
  }

  return NextResponse.json({ received: true })
}
