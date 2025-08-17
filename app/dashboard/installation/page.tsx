'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

type HostInfo = {
  ip: string
  port: string
  token: string
}

export default function Installation() {
  const [img, setImg] = useState('')
  const [host, setHost] = useState<HostInfo | null>(null)

  useEffect(() => {
    fetch('/api/host-info')
      .then((res) => res.json())
      .then(async (data: HostInfo) => {
        setHost(data)
        const qr = await QRCode.toDataURL(JSON.stringify(data))
        setImg(qr)
      })
  }, [])

  const base = host ? `http://${host.ip}:${host.port}` : ''

  return (
    <main style={{ padding: 24 }}>
      <h1>Instalación — Host</h1>
      {img && <img src={img} width={200} height={200} alt="QR" />}
      {host && (
        <div style={{ marginTop: 24 }}>
          <section style={{ marginBottom: 16 }}>
            <h2>Windows</h2>
            <p>
              <a
                href={`${base}/install/windows`}
              >{`${base}/install/windows`}</a>
            </p>
            <pre>
              <code>{`powershell -Command "Invoke-WebRequest -UseBasicParsing ${base}/install.ps1 -OutFile install.ps1; ./install.ps1 -Token ${host.token}"`}</code>
            </pre>
          </section>
          <section>
            <h2>Linux</h2>
            <p>
              <a href={`${base}/install/linux`}>{`${base}/install/linux`}</a>
            </p>
            <pre>
              <code>{`curl -fsSL ${base}/install.sh | bash -s -- ${host.token}`}</code>
            </pre>
          </section>
        </div>
      )}
    </main>
  )
}
