'use client'
import { useRouter } from 'next/navigation'
export default function Login() {
  const r = useRouter()
  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={() => r.push('/dashboard')}>Entrar (mock)</button>
    </main>
  )
}
