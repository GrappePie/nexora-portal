'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function LogoutButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [hasToken, setHasToken] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasToken(!!localStorage.getItem('token'))
    }
  }, [pathname])
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
  if (!hasToken || pathname === '/login') return null
  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: '1px solid #fff',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      Cerrar sesión
    </button>
  )
}
