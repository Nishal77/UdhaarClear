import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: siteConfig.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/wishlist`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
