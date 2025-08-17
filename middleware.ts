import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth/token'
import { hasPermission, Role } from './lib/auth/roles'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  try {
    const payload = await verifyToken(token)
    if (!hasPermission(payload.role as Role, 'dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
