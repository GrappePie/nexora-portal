import '../styles/globals.css'
import LogoutButton from '../components/LogoutButton'
import SWRegister from './sw-register'

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ),
  title: 'Nexora Portal',
  alternates: { canonical: process.env.NEXT_PUBLIC_BASE_URL }, // opcional
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <SWRegister />
        <header className="bg-dark text-white py-2 px-4 flex items-center justify-between">
          <img src="/logo-nexora-pos.svg" alt="Nexora" className="h-8" />
          <LogoutButton />
        </header>
        {children}
      </body>
    </html>
  )
}
