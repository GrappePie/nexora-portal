import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyToken } from '../../../lib/auth/token'
import { getSubscription, setSubscription } from '../../../lib/subscriptions'

export const runtime = 'nodejs'

export async function GET(req: Request) {
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
  const sub = getSubscription(payload.sub)
  return NextResponse.json(sub || null)
}

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

  const { sessionId } = (await req.json()) as { sessionId: string }
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ message: 'Stripe not configured' }, { status: 500 })
  }
  const stripe = new Stripe(secret)
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const planId = session.metadata?.planId
  if (!planId) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 400 })
  }
  setSubscription(Number(payload.sub), planId)
  return NextResponse.json({ success: true })
}
