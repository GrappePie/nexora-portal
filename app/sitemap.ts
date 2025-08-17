import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_BASE_URL!
    return [{ url: `${base}/`, changeFrequency: 'weekly', priority: 0.8 }]
}
