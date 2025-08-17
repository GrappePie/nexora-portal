'use client'

import { useEffect } from 'react'
import { animate, stagger } from 'animejs'

export default function Home() {
  useEffect(() => {
    animate('.fade-in', {
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutQuad',
      duration: 1000,
      delay: stagger(200),
    })
  }, [])

  return (
    <main className="bg-light text-dark min-h-screen">
      <section className="fade-in opacity-0 text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Nexora POS</h1>
        <p className="text-lg mb-8">
          Plataforma local con PWA y portal en la nube para la gestión de tu taller.
        </p>
        <a
          href="/login"
          className="bg-primary text-white px-8 py-3 rounded hover:bg-secondary transition-colors"
        >
          Ingresar
        </a>
      </section>

      <section className="px-4 py-16">
        <h2 className="fade-in opacity-0 text-3xl font-semibold text-center mb-10">
          Características
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="fade-in opacity-0 bg-light text-dark p-6 rounded shadow border border-primary">
            <h3 className="text-xl font-semibold mb-2">PWA offline</h3>
            <p>
              Instálala en cualquier dispositivo y sigue operando sin conexión en la red
              local.
            </p>
          </div>
          <div className="fade-in opacity-0 bg-light text-dark p-6 rounded shadow border border-primary">
            <h3 className="text-xl font-semibold mb-2">Licencias seguras</h3>
            <p>
              Suscripciones con periodo de gracia y modo limitado al expirar para proteger
              tu negocio.
            </p>
          </div>
          <div className="fade-in opacity-0 bg-light text-dark p-6 rounded shadow border border-primary">
            <h3 className="text-xl font-semibold mb-2">Aprobación externa</h3>
            <p>
              Comparte cotizaciones mediante un túnel seguro para que tus clientes las
              autoricen desde cualquier lugar.
            </p>
          </div>
        </div>
      </section>

      <footer className="fade-in opacity-0 bg-dark text-light text-center py-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nexora. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  )
}
