export function buildWhatsAppShare(quoteId: string, token: string, total: number) {
  const base = process.env.NEXT_PUBLIC_PUBLIC_BASE_EXTERNAL || process.env.NEXT_PUBLIC_PUBLIC_BASE_LAN || ''
  const approveBase = (base || '').replace(/\/$/, '')
  const url = `${approveBase}/approve/${token}`
  const msg =
    `Hola 👋, te compartimos la cotización ${quoteId}. Total estimado: $${total.toFixed(2)} MXN.` +
    `

Revisa y autoriza aquí: ${url}`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}
