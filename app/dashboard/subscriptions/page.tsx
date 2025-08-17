'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Plan {
  id: string
  name: string
  price: number
  benefits: string[]
}

function SubsContent() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<{ planId: string } | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  async function fetchPlans() {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/plans', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) {
        throw new Error('Error al cargar planes')
      }
      const data = (await res.json()) as Plan[]
      setPlans(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSubscription() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/subscriptions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = (await res.json()) as { planId: string } | null
        setSubscription(data)
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    fetchPlans()
    fetchSubscription()
  }, [])

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'success') {
      setMessage('Suscripción completada')
      fetchSubscription()
      router.replace('/dashboard/subscriptions')
    } else if (status === 'cancel') {
      setError('Pago cancelado')
      router.replace('/dashboard/subscriptions')
    }
  }, [searchParams, router])

  const handleSelect = async (planId: string) => {
    try {
      setError(null)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ planId }),
      })
      if (!res.ok) {
        throw new Error('Error al iniciar el pago')
      }
      const data = (await res.json()) as { url: string }
      window.location.href = data.url
    } catch (err) {
      setError('No se pudo iniciar el pago')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Suscripciones</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div style={{ display: 'grid', gap: 16 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}
          >
            <h2>{plan.name}</h2>
            <p>Precio: ${plan.price}</p>
            {subscription?.planId === plan.id && (
              <p style={{ color: 'green' }}>Plan actual</p>
            )}
            <ul>
              {plan.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <button onClick={() => handleSelect(plan.id)}>Seleccionar</button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default function Subs() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <SubsContent />
    </Suspense>
  )
}
