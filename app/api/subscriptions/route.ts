import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth/token'
import { getSubscription } from '../../../lib/subscriptions'

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
