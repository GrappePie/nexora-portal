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
      className="bg-transparent border border-white text-white py-1.5 px-3 rounded cursor-pointer"
    >
      Cerrar sesión
    </button>
  )
}
