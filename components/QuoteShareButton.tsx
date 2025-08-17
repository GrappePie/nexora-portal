'use client'
import { buildWhatsAppShare } from '../lib/share'
interface QuoteShareButtonProps {
  quoteId: string
  token: string
  total: number
}
export default function QuoteShareButton({ quoteId, token, total }: QuoteShareButtonProps) {
  const href = buildWhatsAppShare(quoteId, token, total)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white py-1.5 px-3 rounded"
    >
      Compartir por WhatsApp
    </a>
  )
}
