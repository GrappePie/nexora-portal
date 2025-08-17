'use client'

import { useEffect, useState } from 'react'
import type { Role } from '../../../lib/auth/roles'

interface Invite {
  id: string
  email: string
  role: Role
}

export default function Users() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('user')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchInvites() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/users')
      if (!res.ok) {
        throw new Error('Error al cargar invitaciones')
      }
      const data = (await res.json()) as Invite[]
      setInvites(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const invite = async () => {
    try {
      setError(null)
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      if (!res.ok) {
        throw new Error('No se pudo enviar la invitación')
      }
      setEmail('')
      setRole('user')
      fetchInvites()
    } catch {
      setError('No se pudo enviar la invitación')
    }
  }

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('No se pudo eliminar')
      }
      fetchInvites()
    } catch {
      setError('No se pudo eliminar invitación')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={invite}>Invitar</button>
      </div>
      {!loading && !error && invites.length === 0 && <p>No hay invitaciones</p>}
      <ul style={{ display: 'grid', gap: 16 }}>
        {invites.map((i) => (
          <li
            key={i.id}
            style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
          >
            <div>{i.email}</div>
            <div>Rol: {i.role}</div>
            <button onClick={() => remove(i.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
