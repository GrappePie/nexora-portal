export interface Ticket {
  id: string
  subject: string
  message: string
}

let tickets: Ticket[] = []

export function listTickets() {
  return tickets
}

export function addTicket(subject: string, message: string) {
  const ticket: Ticket = {
    id: Math.random().toString(36).slice(2),
    subject,
    message,
  }
  tickets.push(ticket)
  return ticket
}
