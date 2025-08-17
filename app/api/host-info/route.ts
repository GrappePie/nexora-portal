import { NextResponse } from 'next/server'
import os from 'os'

export async function GET() {
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
  const token = process.env.PROVISION_TOKEN || 'ABC12345'
  return NextResponse.json({ ip, port, token })
}
