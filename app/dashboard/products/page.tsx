"use client"

import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

const PAGE_SIZE = 10

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        const res = await fetch('/api/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) {
          throw new Error('Error al cargar productos')
        }
        const data = (await res.json()) as Product[]
        setProducts(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const start = page * PAGE_SIZE
  const current = products.slice(start, start + PAGE_SIZE)
  const hasPrev = page > 0
  const hasNext = start + PAGE_SIZE < products.length

  return (
    <main style={{ padding: 24 }}>
      <h1>Productos</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && current.length === 0 && <p>No hay productos</p>}
      <div style={{ display: 'grid', gap: 16 }}>
        {current.map((p) => (
          <div
            key={p.id}
            style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
          >
            <h2>{p.name}</h2>
            <p>Estado: {p.status}</p>
            <p>Creado: {new Date(p.createdAt).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(p.updatedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {(hasPrev || hasNext) && (
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => setPage((p) => p - 1)} disabled={!hasPrev}>
            Anterior
          </button>
          <button onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
            Siguiente
          </button>
        </div>
      )}
    </main>
  )
}
