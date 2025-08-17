import { NextResponse } from 'next/server'

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

export async function GET() {
  return NextResponse.json(plans)
}
