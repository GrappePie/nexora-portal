import { NextResponse } from 'next/server'
import { listDevices } from '../../../lib/devices'

export async function GET() {
  return NextResponse.json(listDevices())
}
