import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_BASE_URL!
    const now = new Date()
    return [
        {
            url: `${base}/`,
            lastModified: now,            // 👈 nuevo
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]
}
