// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',                // autorise tout par défaut
      // disallow: '/private/',  // exemple pour bloquer un dossier
    },
    sitemap: 'https://humartz.com/sitemap.xml',  // optionnel mais très utile
  };
}