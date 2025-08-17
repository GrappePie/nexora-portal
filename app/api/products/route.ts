import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth/token'
import { listProducts } from '../../../lib/products'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const token = auth.split(' ')[1]
  try {
    verifyToken(token)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(listProducts())
}
