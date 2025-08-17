import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyToken } from '../../../lib/auth/token'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

const priceMap: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const token = auth.split(' ')[1]
  let payload
  try {
    payload = verifyToken(token)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { planId } = (await req.json()) as { planId: string }
  const price = priceMap[planId]
  if (!price) {
    return NextResponse.json({ message: 'Invalid plan' }, { status: 400 })
  }

  const origin = req.headers.get('origin') || 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/dashboard/subscriptions?status=success`,
    cancel_url: `${origin}/dashboard/subscriptions?status=cancel`,
    metadata: {
      userId: String(payload.sub),
      planId,
    },
  })

  return NextResponse.json({ url: session.url })
}
