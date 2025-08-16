export default function sitemap(){ const base=process.env.NEXT_PUBLIC_BASE_URL!;
    return [{ url: `${base}/`, changeFrequency: 'weekly', priority: 0.8 }]; }
