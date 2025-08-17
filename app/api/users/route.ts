import { NextResponse } from 'next/server'
import { addInvite, listInvites } from '../../../lib/users'

export async function GET() {
  return NextResponse.json(listInvites())
}

export async function POST(req: Request) {
  const { email, role } = await req.json()
  if (!email || !role) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
  }
  const invite = addInvite(email, role)
  return NextResponse.json(invite, { status: 201 })
}
