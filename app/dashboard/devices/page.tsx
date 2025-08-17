'use client'

import { useEffect, useState } from 'react'

interface Device {
  id: string
  name: string
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchDevices() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/devices')
      if (!res.ok) {
        throw new Error('Error al cargar dispositivos')
      }
      const data = (await res.json()) as Device[]
      setDevices(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const rename = async (id: string) => {
    const name = prompt('Nuevo nombre del dispositivo')
    if (!name) return
    try {
      const res = await fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        throw new Error('No se pudo renombrar')
      }
      fetchDevices()
    } catch {
      setError('No se pudo renombrar dispositivo')
    }
  }

  const revoke = async (id: string) => {
    try {
      const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('No se pudo revocar')
      }
      fetchDevices()
    } catch {
      setError('No se pudo revocar dispositivo')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Dispositivos</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && devices.length === 0 && <p>No hay dispositivos</p>}
      <ul style={{ display: 'grid', gap: 16 }}>
        {devices.map((d) => (
          <li
            key={d.id}
            style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
          >
            <strong>{d.name}</strong>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => rename(d.id)}>Renombrar</button>
              <button onClick={() => revoke(d.id)}>Revocar</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
