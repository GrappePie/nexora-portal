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
      <body style={{ fontFamily: 'Inter,system-ui', margin: 0 }}>
        <SWRegister />
        <header
          style={{
            backgroundColor: '#111827',
            color: '#fff',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <LogoutButton />
        </header>
        {children}
      </body>
    </html>
  )
}
