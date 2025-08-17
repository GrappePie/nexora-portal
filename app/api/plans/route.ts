import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth/token'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    benefits: ['Característica A'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    benefits: ['Característica A', 'Característica B'],
  },
]

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const token = auth.split(' ')[1]
  try {
    await verifyToken(token)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(plans)
}
