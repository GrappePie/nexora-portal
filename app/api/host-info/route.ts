import { NextRequest, NextResponse } from 'next/server'
import os from 'os'
import { verifyToken } from '../../../lib/auth/token'
import { hasPermission } from '../../../lib/auth/roles'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const payload = verifyToken(token)
    if (!hasPermission(payload.role as any, 'host-info')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const nets = os.networkInterfaces()
  let ip = '127.0.0.1'
  for (const name of Object.keys(nets)) {
    const netArray = nets[name]
    if (!netArray) continue
    for (const net of netArray) {
      if (net.family === 'IPv4' && !net.internal) {
        ip = net.address
        break
      }
    }
  }
  const port = process.env.PORT || '3000'
  const provisionToken = process.env.PROVISION_TOKEN || 'ABC12345'
  return NextResponse.json({ ip, port, token: provisionToken })
}
