'use client'

import React, { useEffect } from 'react'
import {
  Wrench,
  Server,
  ShieldCheck,
  Cloud,
  QrCode,
  Mail,
  MessageSquare,
  ReceiptText,
  Rocket,
  Database,
  Layers,
  Lock,
} from 'lucide-react'

// Brand palette (from README/docs):
// #F97316 (orange), #2563EB (blue), #111827 (near-black), #F3F4F6 (light gray)

const features = [
  {
    icon: <Wrench className="h-6 w-6" />,
    title: 'POS Taller Automotriz',
    desc: 'Punto de venta diseñado para talleres: órdenes de trabajo, piezas y mano de obra, recibos y seguimiento.',
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: 'On‑prem con Docker Compose',
    desc: 'Se despliega en tu PC/servidor Ubuntu con Docker Compose. Control total y latencia mínima en LAN.',
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: 'PWA + Portal de Suscripciones',
    desc: 'Frontend Next.js PWA con portal para gestionar planes, instalación del host y dispositivos cliente por QR.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Modo offline con días de gracia',
    desc: 'Opera sin Internet por periodos definidos; al expirar, entra en modo limitado hasta revalidar.',
  },
  {
    icon: <ReceiptText className="h-6 w-6" />,
    title: 'CFDI: sandbox primero',
    desc: 'Flujo PAC inicia en sandbox; producción se habilita después. Timbrado integrado a futuro.',
  },
  {
    icon: <QrCode className="h-6 w-6" />,
    title: 'Aprobaciones públicas',
    desc: 'Ruta pública "/approve/*" expuesta por Cloudflare Tunnel para aprobar cotizaciones/trabajos.',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Compartir por WhatsApp',
    desc: 'Compartir comprobantes por WhatsApp (gratis). SMTP opcional para correo.',
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: 'Stack moderno',
    desc: 'Next.js + FastAPI + PostgreSQL + Redis + MinIO. Modular, escalable y auditable.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$',
    bullets: [
      'POS Taller básico',
      '1 host on‑prem',
      'Hasta 2 asientos',
      'Compartir por WhatsApp',
      'Aprobaciones públicas',
    ],
    cta: 'Comenzar',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$$',
    bullets: [
      'Todo en Starter',
      'Hasta 5 asientos',
      'Módulos adicionales',
      'Modo offline extendido',
      'Soporte prioritario',
    ],
    cta: 'Probar Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    bullets: [
      'Multi‑sede',
      'Integraciones avanzadas',
      'SLA y soporte dedicado',
      'Cumplimiento y auditoría',
      'Despliegues asistidos',
    ],
    cta: 'Hablar con ventas',
    highlight: false,
  },
]

export default function Page() {
  useEffect(() => {
    // Cargar Anime.js dinámicamente
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      const anime = (window as any).anime
      if (typeof anime === 'function') {
        // Hero entrance
        anime
          .timeline({ easing: 'easeOutExpo' })
          .add({
            targets: ['.hero-badge'],
            opacity: [0, 1],
            translateY: [8, 0],
            duration: 600,
          })
          .add(
            {
              targets: ['.hero-title'],
              opacity: [0, 1],
              translateY: [18, 0],
              duration: 700,
            },
            '-=200',
          )
          .add(
            {
              targets: ['.hero-sub'],
              opacity: [0, 1],
              translateY: [18, 0],
              duration: 700,
            },
            '-=450',
          )
          .add(
            {
              targets: ['.hero-cta'],
              opacity: [0, 1],
              translateY: [12, 0],
              delay: anime.stagger(120),
              duration: 600,
            },
            '-=450',
          )

        // Floating blobs
        anime({
          targets: '.blob',
          translateY: [0, 14],
          direction: 'alternate',
          easing: 'easeInOutSine',
          duration: 3200,
          loop: true,
          delay: anime.stagger(200),
        })

        // Stagger cards on scroll
        const io = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                anime({
                  targets: entry.target.querySelectorAll('.stagger-child'),
                  opacity: [0, 1],
                  translateY: [18, 0],
                  easing: 'easeOutQuad',
                  delay: anime.stagger(80),
                  duration: 550,
                })
                io.unobserve(entry.target)
              }
            })
          },
          { threshold: 0.2 },
        )

        document
          .querySelectorAll<HTMLElement>('.stagger-container')
          .forEach((el) => io.observe(el))

        // Cleanup observer on component unmount
        return () => io.disconnect()
      }
    }

    // Cleanup script on component unmount
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#0b1220]">
      {/* Background gradient + blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 blob"
          style={{
            background: 'radial-gradient(closest-side, #2563EB, transparent)',
          }}
        />
        <div
          className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl opacity-30 blob"
          style={{
            background: 'radial-gradient(closest-side, #F97316, transparent)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(closest-side, #ffffff, transparent)',
          }}
        />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[#0b1220]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#F97316]" />
            <span className="text-xl font-semibold tracking-tight">Nexora</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white">
              Características
            </a>
            <a href="#product" className="hover:text-white">
              Producto
            </a>
            <a href="#pricing" className="hover:text-white">
              Precios
            </a>
            <a href="#stack" className="hover:text-white">
              Stack
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/docs"
              className="hidden sm:inline-block px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/30 text-sm"
            >
              Docs
            </a>
            <a
              href="/portal"
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-sm"
            >
              Ir al Portal
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-24 sm:pb-16">
          <div className="flex flex-col items-center text-center">
            <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 opacity-0">
              <Rocket className="h-3.5 w-3.5" />
              Multiproducto • Modular • LAN‑first
            </span>
            <h1 className="hero-title mt-6 max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight opacity-0">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-white to-[#2563EB]">
                POS para talleres automotrices
              </span>{' '}
              con experiencia de nivel empresarial
            </h1>
            <p className="hero-sub mt-6 max-w-3xl text-lg sm:text-xl text-slate-300 opacity-0">
              Nexora combina un POS especializado para talleres con un portal de
              suscripciones, despliegue on‑prem con Docker, modo offline con
              días de gracia y rutas públicas de aprobación.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/portal"
                className="hero-cta inline-flex items-center justify-center rounded-xl bg-[#F97316] px-5 py-3 font-medium text-white hover:bg-[#ea580c] opacity-0"
              >
                Empezar ahora
              </a>
              <a
                href="/docs"
                className="hero-cta inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 font-medium hover:border-white/30 opacity-0"
              >
                Ver documentación
              </a>
            </div>
          </div>
        </div>

        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* Product focus */}
      <section id="product" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center stagger-container">
            <div className="stagger-child">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <Wrench className="h-3.5 w-3.5" /> Producto actual
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                Nexora POS Taller
              </h2>
              <p className="mt-3 text-slate-300">
                Ordenes de trabajo, piezas y mano de obra, cotizaciones,
                aprobación por enlace público y entrega de comprobantes por
                WhatsApp. Pensado para operar en LAN y seguir funcionando cuando
                Internet falla.
              </p>
              <ul className="mt-6 space-y-2 text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F97316]" />
                  Despliegue on‑prem con Docker Compose
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />{' '}
                  PWA lista para dispositivos en LAN
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />{' '}
                  Rutas públicas de aprobación (Cloudflare Tunnel)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-fuchsia-400" />{' '}
                  Integración CFDI (sandbox → producción)
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a
                  href="/portal"
                  className="rounded-lg bg-white text-[#0b1220] px-4 py-2 font-semibold hover:bg-slate-200"
                >
                  Probar en mi host
                </a>
                <a
                  href="/docs/pos-taller"
                  className="rounded-lg border border-white/15 px-4 py-2 hover:border-white/30"
                >
                  Leer guía
                </a>
              </div>
            </div>
            <div className="stagger-child">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#0e1628] p-6">
                {/* Mocked app frame */}
                <div className="rounded-xl border border-white/10 bg-[#0f1a30] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-400">app.nexora</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      'Orden de trabajo',
                      'Inventario',
                      'Cotizaciones',
                      'Aprobaciones',
                      'Clientes',
                      'Reportes',
                    ].map((k) => (
                      <div
                        key={k}
                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="text-sm font-medium">{k}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          Demo UI
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl opacity-30"
                  style={{
                    background:
                      'radial-gradient(closest-side, #2563EB, transparent)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Construido para el mundo real
            </h2>
            <p className="mt-3 text-slate-300">
              Operación en LAN, aprobaciones públicas y timbrado (sandbox
              primero). Todo en un stack moderno y modular.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-container">
            {features.map((f, i) => (
              <div
                key={i}
                className="stagger-child rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#F97316]/20 text-white">
                  {f.icon}
                </div>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center stagger-container">
            <div className="stagger-child">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <Layers className="h-3.5 w-3.5" /> Arquitectura
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                Stack modular
              </h2>
              <p className="mt-3 text-slate-300">
                Frontend Next.js (PWA) + API en FastAPI con PostgreSQL, Redis y
                MinIO. Envío por WhatsApp gratis; SMTP opcional. Rutas públicas
                de aprobación detrás de Cloudflare Tunnel.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                  Next.js (App Router)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                  FastAPI
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                  Redis / MinIO
                </li>
              </ul>
            </div>
            <div className="stagger-child">
              <div className="rounded-2xl border border-white/10 bg-[#0f1a30] p-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: <Server className="h-5 w-5" />,
                      t: 'On‑prem (Docker)',
                    },
                    { icon: <Lock className="h-5 w-5" />, t: 'LAN‑first' },
                    { icon: <Mail className="h-5 w-5" />, t: 'WhatsApp/SMTP' },
                    {
                      icon: <ReceiptText className="h-5 w-5" />,
                      t: 'CFDI sandbox',
                    },
                    {
                      icon: <MessageSquare className="h-5 w-5" />,
                      t: 'Aprobaciones',
                    },
                    { icon: <QrCode className="h-5 w-5" />, t: 'QR devices' },
                  ].map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="grid place-items-center h-8 w-8 rounded-lg bg-white/5">
                        {it.icon}
                      </div>
                      <div className="text-sm">{it.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Planes simples
            </h2>
            <p className="mt-3 text-slate-300">
              Precios por suscripción con módulos y asientos. Escala cuando lo
              necesites.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border bg-white/5 p-6 ${
                  p.highlight
                    ? 'border-white/30 shadow-2xl shadow-[#2563EB]/10'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.highlight && (
                    <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-xs">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-4 text-3xl font-extrabold">{p.price}</div>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 w-full rounded-xl px-4 py-2 font-medium ${
                    p.highlight
                      ? 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                      : 'border border-white/15 hover:border-white/30'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1a30] to-[#0c1426] p-8 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Listo para modernizar tu taller
            </h3>
            <p className="mt-2 text-slate-300">
              Despliega en tu host con Docker, comparte por WhatsApp y cobra con
              confianza incluso cuando falle Internet.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/portal"
                className="rounded-xl bg-[#F97316] px-5 py-3 font-semibold hover:bg-[#ea580c]"
              >
                Crear mi espacio
              </a>
              <a
                href="/docs/deploy"
                className="rounded-xl border border-white/15 px-5 py-3 hover:border-white/30"
              >
                Guía de despliegue
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#F97316]" />
            <span>© {new Date().getFullYear()} Nexora</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-slate-200">
              Privacidad
            </a>
            <a href="/terms" className="hover:text-slate-200">
              Términos
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
