import { NextResponse } from 'next/server'
import { addTicket, listTickets } from '../../../lib/support'

export async function GET() {
  return NextResponse.json(listTickets())
}

export async function POST(req: Request) {
  const { subject, message } = await req.json()
  if (!subject || !message) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
  }
  const ticket = addTicket(subject, message)
  return NextResponse.json(ticket, { status: 201 })
}
