# Nexora Portal — Starter

Arranque rápido con Next.js (App Router) y PWA listo.

## Requisitos
- Node.js LTS 20.x
- npm o pnpm
- Git

## Correr en local
```bash
npm install
npm run dev
# http://localhost:3000
```

## Archivos agregados
- app/manifest.ts
- app/head.tsx
- public/icon-192.png, icon-512.png

## Publicación
1. Crea un repo en GitHub y sube este proyecto.
2. En Vercel: Importa desde GitHub (framework Next.js autodetectado).
3. En Cloudflare DNS: crea `CNAME app` apuntando al target que te dé Vercel (DNS only).
