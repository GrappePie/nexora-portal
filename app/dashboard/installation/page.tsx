'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
export default function Installation() {
  const [img, setImg] = useState('')
  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        tenant: 'TENANT123',
        provision: 'ABC12345',
        suggested: 'http://taller.local:3000',
      }),
    ).then(setImg)
  }, [])
  return (
    <main style={{ padding: 24 }}>
      <h1>Instalación — Host</h1>
      {img && <img src={img} width={200} height={200} alt="QR" />}
    </main>
  )
}
