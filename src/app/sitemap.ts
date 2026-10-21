import type { MetadataRoute } from 'next';
import { apps, site, writing } from '@/content/profile';

/** Every page search engines should find, including the blog that lives in public/. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${site.version.replace(/\./g, '-')}T00:00:00Z`);
  return [
    { url: `${site.url}/`, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    ...apps.map((app) => ({
      url: `${site.url}/projects/${app.slug}/`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${site.url}/blog/`, lastModified: updated, changeFrequency: 'monthly', priority: 0.6 },
    ...writing.map((post) => ({
      url: `${site.url}${post.href}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
