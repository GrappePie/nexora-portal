'use client'

import { useEffect, useState } from 'react'

interface Ticket {
  id: string
  subject: string
  message: string
}

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchTickets() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/support')
      if (!res.ok) {
        throw new Error('Error al cargar tickets')
      }
      const data = (await res.json()) as Ticket[]
      setTickets(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const submit = async () => {
    try {
      setError(null)
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })
      if (!res.ok) {
        throw new Error('No se pudo enviar el ticket')
      }
      setSubject('')
      setMessage('')
      fetchTickets()
    } catch {
      setError('No se pudo enviar el ticket')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Soporte</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: 16, display: 'grid', gap: 8 }}>
        <input
          type="text"
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={submit}>Enviar</button>
      </div>
      {loading && <p>Cargando...</p>}
      {!loading && tickets.length === 0 && <p>No hay tickets</p>}
      <ul style={{ display: 'grid', gap: 16 }}>
        {tickets.map((t) => (
          <li
            key={t.id}
            style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
          >
            <strong>{t.subject}</strong>
            <p>{t.message}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
