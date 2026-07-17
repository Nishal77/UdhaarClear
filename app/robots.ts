import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/onboarding',
        '/pay/',
        '/ca/',
        '/dashboard',
        '/customers',
        '/invoices',
        '/settings',
        '/reports',
        '/legal-notices',
        '/payments',
        '/team/',
        '/tone-engine',
        '/reminder-customisation',
        '/whatsapp-email-log',
        '/msme-samadhaan',
        '/wishlist/admin',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
