import { NextResponse } from 'next/server'
import { signToken } from '../../../lib/auth/token'
import { Role } from '../../../lib/auth/roles'

interface User {
  id: number
  email: string
  password: string
  role: Role
}

const users: User[] = [
  { id: 1, email: 'admin@example.com', password: 'password', role: 'admin' },
  { id: 2, email: 'user@example.com', password: 'password', role: 'user' },
]

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = users.find(
    (u) => u.email === email && u.password === password,
  )
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }
  const token = await signToken({ sub: user.id, role: user.role })
  const res = NextResponse.json({ token })
  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
