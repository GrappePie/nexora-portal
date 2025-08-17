'use client'

import { useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export default function SWRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          navigator.serviceWorker.ready.then((reg) => {
            if ('sync' in reg) {
              reg.sync
                .register('sync-outbox')
                .catch((err) => console.error('Sync registration failed', err))
            }
          })
        })
        .catch((err) => console.error('SW registration failed', err))
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      const install = window.confirm('¿Deseas instalar esta app?')
      if (install) {
        e.prompt()
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  return null
}
